import { get, post } from '../api_client';
import { CreateOrderReq } from '../types/request/order_types/order.req';
import { OrderListResponse } from '../types/response/order_types/order.res';
import { OrderResponse } from '../types/response/order_types/order.res';

export const createOrder = async (
  data: CreateOrderReq
): Promise<OrderResponse> => {
  const res = await post('/orders', data);
  return res.data;
};

export const getOrderById = async (id: number): Promise<OrderResponse> => {
  const res = await get(`/orders/${id}`);
  return res.data;
};

export const getUserOrders = async (params?: {
  page?: number;
  size?: number;
}): Promise<OrderListResponse> => {
  const res = await get('/orders/user', params);
  return res.data;
};
