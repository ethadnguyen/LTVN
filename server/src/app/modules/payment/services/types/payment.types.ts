import { CheckoutResponseDataType } from '../../interfaces/checkout-res.type';
import { PaymentLinkDataType } from '../../interfaces/payment-link-data.type';
import { PaymentMethod } from '../../enums/payment-method.enum';

export interface PayosConfig {
  clientId: string;
  apiKey: string;
  checksumKey: string;
  baseUrl: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  redirect_url?: string;
  data?: CheckoutResponseDataType | PaymentLinkDataType;
}

export interface CreatePaymentDto {
  order_id: number;
  amount: number;
  payment_method: PaymentMethod;
}

export interface PaymentCallbackDto {
  order_id: number;
  status: string;
  amount: number;
  transaction_id: string;
  payment_time: Date;
}

export interface UpdatePaymentStatusDto {
  status: string;
  transaction_id?: string;
  payment_time?: Date;
}
