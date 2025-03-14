export enum PaymentMethod {
  VNPAY = 'VNPAY',
  CASH = 'CASH',
}

export interface CreatePaymentReq {
  order_id: number;
  payment_method: PaymentMethod;
  amount: number;
  payment_code?: string;
}
