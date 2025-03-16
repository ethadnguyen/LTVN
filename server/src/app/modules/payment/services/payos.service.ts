import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import PayOS from '@payos/node';
import { PayosConfig, PaymentResponse } from './types/payment.types';
import * as crypto from 'crypto';
import { CheckoutRequestType } from '../interfaces/checkout-req.type';
import { CheckoutResponseDataType } from '../interfaces/checkout-res.type';
import { PaymentLinkDataType } from '../interfaces/payment-link-data.type';

@Injectable()
export class PayosService {
  private readonly logger = new Logger(PayosService.name);
  private payos: PayOS;
  private checksumKey: string;

  constructor(private configService: ConfigService) {
    const payosConfig: PayosConfig = {
      clientId: this.configService.get<string>('payos.clientId'),
      apiKey: this.configService.get<string>('payos.apiKey'),
      checksumKey: this.configService.get<string>('payos.checksumKey'),
      baseUrl: this.configService.get<string>('payos.baseUrl'),
      returnUrl: this.configService.get<string>('payos.returnUrl'),
      cancelUrl: this.configService.get<string>('payos.cancelUrl'),
    };

    this.checksumKey = payosConfig.checksumKey;
    this.payos = new PayOS(
      payosConfig.clientId,
      payosConfig.apiKey,
      payosConfig.checksumKey,
      payosConfig.baseUrl,
    );
  }

  async createPaymentLink(
    orderId: number,
    amount: number,
    description: string,
    items: Array<{ name: string; quantity: number; price: number }> = [],
  ): Promise<PaymentResponse> {
    try {
      const orderCode = `${orderId}_${Date.now()}`;
      const returnUrl = this.configService.get<string>('payos.returnUrl');
      const cancelUrl = this.configService.get<string>('payos.cancelUrl');

      const paymentData: CheckoutRequestType = {
        orderCode: Number(orderCode),
        amount,
        description,
        returnUrl,
        cancelUrl,
        items: items,
      };

      const response = await this.payos.createPaymentLink(paymentData);

      this.logger.log(
        `Created payment link for order ${orderId}: ${JSON.stringify(response)}`,
      );

      // Kiểm tra cấu trúc response từ PayOS
      const responseData = response.hasOwnProperty('data')
        ? ((response as any).data as CheckoutResponseDataType)
        : (response as CheckoutResponseDataType);

      if (responseData && responseData.checkoutUrl) {
        return {
          success: true,
          message: 'Tạo liên kết thanh toán thành công',
          redirect_url: responseData.checkoutUrl,
          data: responseData,
        };
      }

      return {
        success: false,
        message: 'Không thể tạo liên kết thanh toán',
        data: responseData,
      };
    } catch (error) {
      this.logger.error(
        `Error creating payment link: ${error.message}`,
        error.stack,
      );
      return {
        success: false,
        message: `Lỗi khi tạo liên kết thanh toán: ${error.message}`,
      };
    }
  }

  async verifyPaymentWebhook(
    webhookData: any,
    payosSignature: string,
  ): Promise<boolean> {
    try {
      // Tự tạo hàm xác minh chữ ký webhook dựa trên checksumKey
      if (!webhookData || !payosSignature || !this.checksumKey) {
        return false;
      }

      // Chuyển đổi dữ liệu webhook thành chuỗi JSON
      const dataString =
        typeof webhookData === 'string'
          ? webhookData
          : JSON.stringify(webhookData);

      // Tạo HMAC với checksumKey
      const hmac = crypto.createHmac('sha256', this.checksumKey);
      hmac.update(dataString);
      const calculatedSignature = hmac.digest('hex');

      // So sánh chữ ký tính toán với chữ ký nhận được
      return calculatedSignature === payosSignature;
    } catch (error) {
      this.logger.error(
        `Error verifying webhook: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }

  async getPaymentInfo(
    paymentLinkId: string,
  ): Promise<PaymentLinkDataType | null> {
    try {
      const response =
        await this.payos.getPaymentLinkInformation(paymentLinkId);

      // Kiểm tra cấu trúc response từ PayOS
      const paymentData = response.hasOwnProperty('data')
        ? ((response as any).data as PaymentLinkDataType)
        : (response as PaymentLinkDataType);

      return paymentData;
    } catch (error) {
      this.logger.error(
        `Error getting payment info: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }
}
