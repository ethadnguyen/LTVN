import { PaymentMethod } from '../../request/payment_types/payment.req';

export interface PaymentResponse {
  id: number;
  order_id: number;
  payment_method: PaymentMethod;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  payment_code?: string;
}

export interface PaymentWithUrlResponse {
  payment: PaymentResponse;
  paymentUrl: string;
}
