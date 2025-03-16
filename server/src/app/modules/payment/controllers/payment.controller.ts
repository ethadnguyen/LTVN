import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import {
  CreatePaymentDto,
  PaymentCallbackDto,
  UpdatePaymentStatusDto,
} from '../services/types/payment.types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { WebhookType } from '../interfaces/webhook.type';

@Controller('payments')
@ApiTags('Payment')
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createPayment(createPaymentDto);
  }

  @Get('order/:orderId')
  async getPaymentByOrderId(@Param('orderId') orderId: number) {
    return this.paymentService.getPaymentByOrderId(orderId);
  }

  @Put(':id/status')
  async updatePaymentStatus(
    @Param('id') id: number,
    @Body() updateStatusDto: UpdatePaymentStatusDto,
  ) {
    return this.paymentService.updatePaymentStatus(id, updateStatusDto);
  }

  @Post('callback')
  async handlePaymentCallback(@Body() callbackData: PaymentCallbackDto) {
    return this.paymentService.handlePaymentCallback(callbackData);
  }

  @Post('webhook')
  async handlePaymentWebhook(
    @Body() webhookData: WebhookType,
    @Headers('x-payos-signature') signature: string,
  ) {
    const isValid = await this.paymentService.verifyPaymentWebhook(
      webhookData,
      signature,
    );

    if (!isValid) {
      return {
        success: false,
        message: 'Chữ ký không hợp lệ',
      };
    }

    // Xử lý dữ liệu webhook
    const orderIdParts = webhookData.data.orderCode.toString().split('_');
    const orderId =
      orderIdParts.length > 1
        ? parseInt(orderIdParts[0])
        : parseInt(orderIdParts[0]);

    const paymentData: PaymentCallbackDto = {
      order_id: orderId,
      status: webhookData.data.code === '00' ? 'SUCCESS' : 'FAILED',
      amount: webhookData.data.amount,
      transaction_id: webhookData.data.reference,
      payment_time: new Date(webhookData.data.transactionDateTime),
    };

    return this.paymentService.handlePaymentCallback(paymentData);
  }
}
