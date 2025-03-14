import { PaymentMethod } from '../../enums/payment-method.enum';

export class CreatePaymentInput {
  order_id: number;
  payment_method: PaymentMethod;
  amount: number;
  payment_code?: string;
}
