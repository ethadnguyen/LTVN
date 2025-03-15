import { del, get, post, put } from '../api_client';
import {
  CreateOrderReq,
  UpdateOrderReq,
} from '../types/request/order_types/order.req';
import { OrderListResponse } from '../types/response/order_types/order.res';
import { OrderResponse } from '../types/response/order_types/order.res';

interface GetAllOrderParams {
  page?: number;
  size?: number;
  user_id: number;
}

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

export const getAllOrders = async (
  params?: GetAllOrderParams
): Promise<OrderListResponse> => {
  const res = await get('/orders/all', params);
  return res.data;
};

export const updateOrder = async (
  id: number,
  data: UpdateOrderReq
): Promise<OrderResponse> => {
  const res = await put(`/orders/update`, data);
  return res.data;
};

export const deleteOrder = async (id: number): Promise<void> => {
  await del(`/orders/${id}`);
};
