import { AddressResponse } from '../address_types/address.res';
import { PaginationRes } from '../pagination_types/pagination-res';

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPING = 'shipping',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}
export interface OrderItemResponse {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    price: number;
    images?: string[];
    [key: string]: unknown;
  };
}

export interface OrderResponse {
  id: number;
  order_items: OrderItemResponse[];
  total_price: number;
  original_price: number;
  discount_amount: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  address: AddressResponse;
  user: {
    user_id: number;
    user_name: string;
    email: string;
    [key: string]: unknown;
  };
}

export interface OrderListResponse extends PaginationRes {
  orders: OrderResponse[];
}
