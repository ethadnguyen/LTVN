import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Payment } from '../entities/payment.entity';
import { VnPayCallbackDto } from '../dto/vnpay-callback.dto';
import { PaymentStatus } from '../enums/payment-status.enum';
import { Order } from '../../orders/entities/order.entity';
import { PaymentRepository } from '../repositories/payment.repositories';
import { CreatePaymentInput } from './types/create-payment.input';
import { OrderStatus } from '../../orders/enums/order-status.enum';
import * as crypto from 'crypto';
import { OrderRepository } from '../../orders/repositories/order.repositories';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly MAX_RETRY_COUNT = 3;
  private readonly RETRY_DELAY_MINUTES = 30;

  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly orderRepository: OrderRepository,
    private configService: ConfigService,
  ) {}

  async createPayment(
    createPaymentInput: CreatePaymentInput,
  ): Promise<Payment> {
    try {
      if (createPaymentInput.amount <= 0) {
        throw new BadRequestException('Amount must be greater than 0');
      }

      const order = await this.orderRepository.findById(
        createPaymentInput.order_id,
      );

      if (!order) {
        throw new BadRequestException('Order not found');
      }

      const payment =
        await this.paymentRepository.createPaymentWithTransaction(
          createPaymentInput,
        );

      this.logger.log(`Created payment for order ${order.id}`);
      return payment;
    } catch (error) {
      this.logger.error(
        `Failed to create payment: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async createVnPayUrl(
    payment: Payment,
    ipAddr: string = '127.0.0.1',
  ): Promise<string> {
    try {
      const vnpConfig = this.configService.get('vnpay');
      const vnpUrl = vnpConfig.vnp_Url;
      const returnUrl = vnpConfig.vnp_ReturnUrl;
      const tmnCode = vnpConfig.vnp_TmnCode;
      const hashSecret = vnpConfig.vnp_HashSecret;

      const date = new Date();
      const createDate = date.toISOString().replace(/[-:]/g, '').split('.')[0];

      const orderId = `${payment.id}_${Date.now()}`;
      const amount = payment.amount * 100; // Convert to VND

      const orderInfo = `Thanh toan don hang #${payment.order_id}`;
      const orderType = 'billpayment';
      const locale = 'vn';

      const vnpParams = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: tmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: 'VND',
        vnp_TxnRef: orderId,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: orderType,
        vnp_Amount: amount,
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
      };

      const sortedParams = this.sortObject(vnpParams);
      const signData = this.createQueryString(sortedParams);
      const hmac = crypto.createHmac('sha512', hashSecret);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

      vnpParams['vnp_SecureHash'] = signed;

      this.logger.log(`Created VNPay URL for payment ${payment.id}`);
      return `${vnpUrl}?${this.createQueryString(vnpParams)}`;
    } catch (error) {
      this.logger.error(
        `Failed to create VNPay URL: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async handleVnPayCallback(callbackData: VnPayCallbackDto): Promise<Payment> {
    try {
      // Xác thực chữ ký
      const isValid = this.validateVnPaySignature(callbackData);
      if (!isValid) {
        throw new BadRequestException('Invalid signature');
      }

      // Tìm payment dựa trên vnp_TxnRef
      const paymentId = callbackData.vnp_TxnRef.split('_')[0];
      const payment = await this.paymentRepository.findPaymentById(
        parseInt(paymentId),
      );

      if (!payment) {
        throw new BadRequestException('Payment not found');
      }

      // Xử lý kết quả thanh toán
      if (callbackData.vnp_ResponseCode === '00') {
        // Thanh toán thành công
        return await this.handleSuccessfulPayment(payment, callbackData);
      } else {
        // Thanh toán thất bại
        return await this.handleFailedPayment(payment, callbackData);
      }
    } catch (error) {
      this.logger.error(
        `Failed to handle VNPay callback: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async handleSuccessfulPayment(
    payment: Payment,
    callbackData: VnPayCallbackDto,
  ): Promise<Payment> {
    // Cập nhật trạng thái payment
    const updatedPayment = await this.paymentRepository.updatePaymentStatus(
      payment.id,
      PaymentStatus.SUCCESS,
      callbackData,
    );

    // Cập nhật trạng thái order
    await this.orderRepository.update(payment.order_id, {
      status: OrderStatus.PAID,
    });

    this.logger.log(`Payment ${payment.id} completed successfully`);
    return updatedPayment;
  }

  private async handleFailedPayment(
    payment: Payment,
    callbackData: VnPayCallbackDto,
  ): Promise<Payment> {
    const retryCount = (payment.retry_count || 0) + 1;
    const lastRetryTime = new Date();

    // Cập nhật thông tin lỗi
    const updatedPayment = await this.paymentRepository.updatePaymentStatus(
      payment.id,
      PaymentStatus.FAILED,
      {
        ...callbackData,
        error_code: callbackData.vnp_ResponseCode,
        error_message: this.getErrorMessage(callbackData.vnp_ResponseCode),
        retry_count: retryCount,
        last_retry_time: lastRetryTime,
        failure_reason: this.getFailureReason(callbackData.vnp_ResponseCode),
      },
    );

    // Kiểm tra xem có thể thử lại không
    if (retryCount < this.MAX_RETRY_COUNT) {
      this.logger.log(
        `Payment ${payment.id} failed. Retry count: ${retryCount}/${this.MAX_RETRY_COUNT}`,
      );
    } else {
      this.logger.error(
        `Payment ${payment.id} failed permanently after ${retryCount} attempts`,
      );
      // Có thể thêm logic xử lý khi đã hết số lần thử lại
      // Ví dụ: gửi email thông báo, tạo ticket support, etc.
    }

    return updatedPayment;
  }

  private getErrorMessage(responseCode: string): string {
    const errorMessages: Record<string, string> = {
      '01': 'Giao dịch chưa hoàn tất',
      '02': 'Giao dịch đã tồn tại',
      '03': 'Mã đơn hàng không tồn tại',
      '04': 'Số tiền không hợp lệ',
      '05': 'Tài khoản không đủ số dư',
      '06': 'Ngân hàng đang bảo trì',
      '07': 'Giao dịch bị từ chối',
      '08': 'Thông tin tài khoản không chính xác',
      '09': 'Tài khoản bị khóa',
      '10': 'Giao dịch đã hết hạn',
      '11': 'Mã giao dịch không tồn tại',
      '12': 'Giao dịch không hợp lệ',
      '13': 'Giao dịch đã bị hủy',
      '14': 'Giao dịch đã được hoàn tiền',
      '15': 'Giao dịch đang xử lý',
      '16': 'Giao dịch đã được duyệt',
      '17': 'Giao dịch đã bị từ chối',
      '18': 'Giao dịch đã bị hủy',
      '19': 'Giao dịch đã được hoàn tiền',
      '20': 'Giao dịch đang xử lý',
      '21': 'Giao dịch đã được duyệt',
      '22': 'Giao dịch đã bị từ chối',
      '23': 'Giao dịch đã bị hủy',
      '24': 'Giao dịch đã được hoàn tiền',
      '25': 'Giao dịch đang xử lý',
      '26': 'Giao dịch đã được duyệt',
      '27': 'Giao dịch đã bị từ chối',
      '28': 'Giao dịch đã bị hủy',
      '29': 'Giao dịch đã được hoàn tiền',
      '30': 'Giao dịch đang xử lý',
      '31': 'Giao dịch đã được duyệt',
      '32': 'Giao dịch đã bị từ chối',
      '33': 'Giao dịch đã bị hủy',
      '34': 'Giao dịch đã được hoàn tiền',
      '35': 'Giao dịch đang xử lý',
      '36': 'Giao dịch đã được duyệt',
      '37': 'Giao dịch đã bị từ chối',
      '38': 'Giao dịch đã bị hủy',
      '39': 'Giao dịch đã được hoàn tiền',
      '40': 'Giao dịch đang xử lý',
      '41': 'Giao dịch đã được duyệt',
      '42': 'Giao dịch đã bị từ chối',
      '43': 'Giao dịch đã bị hủy',
      '44': 'Giao dịch đã được hoàn tiền',
      '45': 'Giao dịch đang xử lý',
      '46': 'Giao dịch đã được duyệt',
      '47': 'Giao dịch đã bị từ chối',
      '48': 'Giao dịch đã bị hủy',
      '49': 'Giao dịch đã được hoàn tiền',
      '50': 'Giao dịch đang xử lý',
      '51': 'Giao dịch đã được duyệt',
      '52': 'Giao dịch đã bị từ chối',
      '53': 'Giao dịch đã bị hủy',
      '54': 'Giao dịch đã được hoàn tiền',
      '55': 'Giao dịch đang xử lý',
      '56': 'Giao dịch đã được duyệt',
      '57': 'Giao dịch đã bị từ chối',
      '58': 'Giao dịch đã bị hủy',
      '59': 'Giao dịch đã được hoàn tiền',
      '60': 'Giao dịch đang xử lý',
      '61': 'Giao dịch đã được duyệt',
      '62': 'Giao dịch đã bị từ chối',
      '63': 'Giao dịch đã bị hủy',
      '64': 'Giao dịch đã được hoàn tiền',
      '65': 'Giao dịch đang xử lý',
      '66': 'Giao dịch đã được duyệt',
      '67': 'Giao dịch đã bị từ chối',
      '68': 'Giao dịch đã bị hủy',
      '69': 'Giao dịch đã được hoàn tiền',
      '70': 'Giao dịch đang xử lý',
      '71': 'Giao dịch đã được duyệt',
      '72': 'Giao dịch đã bị từ chối',
      '73': 'Giao dịch đã bị hủy',
      '74': 'Giao dịch đã được hoàn tiền',
      '75': 'Giao dịch đang xử lý',
      '76': 'Giao dịch đã được duyệt',
      '77': 'Giao dịch đã bị từ chối',
      '78': 'Giao dịch đã bị hủy',
      '79': 'Giao dịch đã được hoàn tiền',
      '80': 'Giao dịch đang xử lý',
      '81': 'Giao dịch đã được duyệt',
      '82': 'Giao dịch đã bị từ chối',
      '83': 'Giao dịch đã bị hủy',
      '84': 'Giao dịch đã được hoàn tiền',
      '85': 'Giao dịch đang xử lý',
      '86': 'Giao dịch đã được duyệt',
      '87': 'Giao dịch đã bị từ chối',
      '88': 'Giao dịch đã bị hủy',
      '89': 'Giao dịch đã được hoàn tiền',
      '90': 'Giao dịch đang xử lý',
      '91': 'Giao dịch đã được duyệt',
      '92': 'Giao dịch đã bị từ chối',
      '93': 'Giao dịch đã bị hủy',
      '94': 'Giao dịch đã được hoàn tiền',
      '95': 'Giao dịch đang xử lý',
      '96': 'Giao dịch đã được duyệt',
      '97': 'Giao dịch đã bị từ chối',
      '98': 'Giao dịch đã bị hủy',
      '99': 'Giao dịch đã được hoàn tiền',
    };

    return errorMessages[responseCode] || 'Lỗi không xác định';
  }

  private getFailureReason(responseCode: string): string {
    const failureReasons: Record<string, string> = {
      '01': 'Giao dịch chưa hoàn tất',
      '02': 'Giao dịch đã tồn tại',
      '03': 'Mã đơn hàng không tồn tại',
      '04': 'Số tiền không hợp lệ',
      '05': 'Tài khoản không đủ số dư',
      '06': 'Ngân hàng đang bảo trì',
      '07': 'Giao dịch bị từ chối',
      '08': 'Thông tin tài khoản không chính xác',
      '09': 'Tài khoản bị khóa',
      '10': 'Giao dịch đã hết hạn',
    };

    return failureReasons[responseCode] || 'Lỗi không xác định';
  }

  async getPaymentsByOrderId(orderId: number): Promise<Payment[]> {
    return this.paymentRepository.findPaymentsByOrderId(orderId);
  }

  private sortObject(obj: any): any {
    const sorted = {};
    const str = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (const key of str) {
      sorted[key] = obj[key];
    }
    return sorted;
  }

  private createQueryString(obj: any): string {
    return Object.keys(obj)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`,
      )
      .join('&');
  }

  private validateVnPaySignature(callbackData: VnPayCallbackDto): boolean {
    const vnpConfig = this.configService.get('vnpay');
    const hashSecret = vnpConfig.vnp_HashSecret;
    const secureHash = callbackData.vnp_SecureHash;
    delete callbackData.vnp_SecureHash;

    const sortedParams = this.sortObject(callbackData);
    const signData = this.createQueryString(sortedParams);
    const hmac = crypto.createHmac('sha512', hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    return secureHash === signed;
  }
}
