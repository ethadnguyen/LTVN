import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Redirect,
} from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { VnPayCallbackDto } from '../dto/vnpay-callback.dto';
import { Payment } from '../entities/payment.entity';
import { CreatePaymentReq } from './types/create-payment.req';
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  async createPayment(
    @Body() createPaymentReq: CreatePaymentReq,
  ): Promise<{ payment: Payment; paymentUrl: string }> {
    const payment = await this.paymentService.createPayment(createPaymentReq);
    const paymentUrl = await this.paymentService.createVnPayUrl(payment);
    return { payment, paymentUrl };
  }

  @Get('order/:orderId')
  async getPaymentsByOrderId(
    @Param('orderId') orderId: number,
  ): Promise<Payment[]> {
    return this.paymentService.getPaymentsByOrderId(orderId);
  }

  @Get('vnpay/return')
  @Redirect()
  async handleVnPayReturn(@Query() query: VnPayCallbackDto) {
    try {
      const payment = await this.paymentService.handleVnPayCallback(query);

      // Chuyển hướng về trang frontend với kết quả
      return {
        url: `/payment-result?status=${payment.status}&orderId=${payment.order_id}`,
      };
    } catch (error) {
      return {
        url: `/payment-result?status=error&message=${error.message}`,
      };
    }
  }
}
