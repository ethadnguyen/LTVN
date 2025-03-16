import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PaymentRepository } from '../repositories/payment.repositories';
import { PayosService } from './payos.service';
import { PaymentMethod } from '../enums/payment-method.enum';
import { PaymentStatus } from '../enums/payment-status.enum';
import {
  CreatePaymentDto,
  PaymentCallbackDto,
  PaymentResponse,
  UpdatePaymentStatusDto,
} from './types/payment.types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { PaymentStatus as OrderPaymentStatus } from '../../orders/enums/payment-status.enum';
import { OrderRepository } from '../../orders/repositories/order.repositories';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly payosService: PayosService,
    private readonly orderRepository: OrderRepository,
  ) {}

  async createPayment(
    createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentResponse> {
    try {
      const { order_id, amount, payment_method } = createPaymentDto;

      // Kiểm tra đơn hàng tồn tại
      const order = await this.orderRepository.findById(order_id);
      if (!order) {
        return {
          success: false,
          message: `Không tìm thấy đơn hàng với ID: ${order_id}`,
        };
      }

      // Kiểm tra xem đã có thanh toán cho đơn hàng này chưa
      const existingPayment =
        await this.paymentRepository.findByOrderId(order_id);
      if (existingPayment) {
        // Nếu đã thanh toán thành công, trả về thông báo
        if (existingPayment.status === PaymentStatus.SUCCESS) {
          return {
            success: false,
            message: 'Đơn hàng này đã được thanh toán',
          };
        }

        // Nếu đang chờ thanh toán, cập nhật phương thức thanh toán
        await this.paymentRepository.update(existingPayment.id, {
          payment_method,
        });
      } else {
        // Tạo mới thanh toán
        await this.paymentRepository.create({
          order_id,
          amount,
          payment_method,
          status: PaymentStatus.PENDING,
        });
      }

      // Xử lý theo phương thức thanh toán
      switch (payment_method) {
        case PaymentMethod.BANK_TRANSFER:
          return this.processBankTransfer(order_id, amount);
        case PaymentMethod.COD:
          return this.processCodPayment(order_id);
        default:
          return {
            success: false,
            message: 'Phương thức thanh toán không được hỗ trợ',
          };
      }
    } catch (error) {
      this.logger.error(
        `Error creating payment: ${error.message}`,
        error.stack,
      );
      return {
        success: false,
        message: `Lỗi khi tạo thanh toán: ${error.message}`,
      };
    }
  }

  private async processBankTransfer(
    orderId: number,
    amount: number,
  ): Promise<PaymentResponse> {
    try {
      // Lấy thông tin chi tiết về đơn hàng bao gồm các sản phẩm
      const order = await this.orderRepository.findById(orderId);
      if (!order || !order.order_items || order.order_items.length === 0) {
        throw new Error(
          `Không tìm thấy thông tin chi tiết đơn hàng: ${orderId}`,
        );
      }

      // Tạo danh sách items cho PayOS
      const paymentItems = order.order_items.map((item) => ({
        name: item.product ? item.product.name : `Sản phẩm #${item.product.id}`,
        quantity: item.quantity,
        price: item.price,
      }));

      const description = `Thanh toán đơn hàng #${orderId}`;
      return this.payosService.createPaymentLink(
        orderId,
        amount,
        description,
        paymentItems,
      );
    } catch (error) {
      this.logger.error(
        `Error processing bank transfer: ${error.message}`,
        error.stack,
      );
      const description = `Thanh toán đơn hàng #${orderId}`;
      return this.payosService.createPaymentLink(orderId, amount, description);
    }
  }

  private async processCodPayment(orderId: number): Promise<PaymentResponse> {
    try {
      const payment = await this.paymentRepository.findByOrderId(orderId);
      if (payment) {
        await this.paymentRepository.update(payment.id, {
          status: PaymentStatus.PENDING,
        });
      }

      await this.orderRepository.update(orderId, {
        payment_method: PaymentMethod.COD,
      });

      return {
        success: true,
        message:
          'Đơn hàng đã được đặt thành công với phương thức thanh toán COD',
      };
    } catch (error) {
      this.logger.error(
        `Error processing COD payment: ${error.message}`,
        error.stack,
      );
      return {
        success: false,
        message: `Lỗi khi xử lý thanh toán COD: ${error.message}`,
      };
    }
  }

  async handlePaymentCallback(
    paymentCallbackDto: PaymentCallbackDto,
  ): Promise<PaymentResponse> {
    try {
      const { order_id, status, transaction_id, payment_time } =
        paymentCallbackDto;

      // Tìm thanh toán theo order_id
      const payment = await this.paymentRepository.findByOrderId(order_id);
      if (!payment) {
        return {
          success: false,
          message: `Không tìm thấy thanh toán cho đơn hàng: ${order_id}`,
        };
      }

      const paymentStatus =
        status.toUpperCase() === 'SUCCESS'
          ? PaymentStatus.SUCCESS
          : PaymentStatus.FAILED;

      await this.paymentRepository.update(payment.id, {
        status: paymentStatus,
        transaction_id,
        payment_time,
      });

      // Cập nhật trạng thái đơn hàng
      if (paymentStatus === PaymentStatus.SUCCESS) {
        await this.orderRepository.update(order_id, {
          payment_status: OrderPaymentStatus.PAID,
          paid_at: payment_time,
        });
      }

      return {
        success: true,
        message: `Cập nhật trạng thái thanh toán thành công: ${paymentStatus}`,
      };
    } catch (error) {
      this.logger.error(
        `Error handling payment callback: ${error.message}`,
        error.stack,
      );
      return {
        success: false,
        message: `Lỗi khi xử lý callback thanh toán: ${error.message}`,
      };
    }
  }

  async getPaymentByOrderId(orderId: number) {
    const payment = await this.paymentRepository.findByOrderId(orderId);
    if (!payment) {
      throw new NotFoundException(
        `Không tìm thấy thanh toán cho đơn hàng: ${orderId}`,
      );
    }
    return payment;
  }

  async updatePaymentStatus(
    paymentId: number,
    updateStatusDto: UpdatePaymentStatusDto,
  ): Promise<PaymentResponse> {
    try {
      const payment = await this.paymentRepository.findById(paymentId);
      if (!payment) {
        return {
          success: false,
          message: `Không tìm thấy thanh toán với ID: ${paymentId}`,
        };
      }

      const paymentStatus = updateStatusDto.status as unknown as PaymentStatus;
      await this.paymentRepository.update(paymentId, {
        status: paymentStatus,
        transaction_id: updateStatusDto.transaction_id,
        payment_time: updateStatusDto.payment_time,
      });

      // Nếu thanh toán thành công, cập nhật trạng thái đơn hàng
      if (updateStatusDto.status === PaymentStatus.SUCCESS) {
        await this.orderRepository.update(payment.order_id, {
          payment_status: OrderPaymentStatus.PAID,
          paid_at: updateStatusDto.payment_time || new Date(),
        });
      }

      return {
        success: true,
        message: 'Cập nhật trạng thái thanh toán thành công',
      };
    } catch (error) {
      this.logger.error(
        `Error updating payment status: ${error.message}`,
        error.stack,
      );
      return {
        success: false,
        message: `Lỗi khi cập nhật trạng thái thanh toán: ${error.message}`,
      };
    }
  }

  async verifyPaymentWebhook(
    webhookData: any,
    signature: string,
  ): Promise<boolean> {
    return this.payosService.verifyPaymentWebhook(webhookData, signature);
  }
}
