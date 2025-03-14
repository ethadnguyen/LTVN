import { get, post } from '../api_client';
import { CreatePaymentReq } from '../types/request/payment_types/payment.req';
import { PaymentWithUrlResponse } from '../types/response/payment_types/payment.res';

export const createPayment = async (
  data: CreatePaymentReq
): Promise<PaymentWithUrlResponse> => {
  const res = await post('/payments/create', data);
  return res.data;
};

export const getPaymentsByOrderId = async (
  orderId: number
): Promise<PaymentResponse[]> => {
  const res = await get(`/payments/order/${orderId}`);
  return res.data;
};
