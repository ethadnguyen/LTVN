import { OrderStatus } from '../../response/order_types/order.res';
import { CreateAddressRequest } from '../address_types/address.req';

export interface CreateOrderItemReq {
  product_id: number;
  quantity: number;
}

export interface CreateOrderReq {
  order_items: CreateOrderItemReq[];
  total_price: number;
  phone: string;
  address_id?: number;
  new_address?: CreateAddressRequest;
  promotion_id?: number;
  user_id: number;
}

export interface UpdateOrderReq {
  id: number;
  status: OrderStatus;
  order_items?: CreateOrderItemReq[];
  address_id?: number;
  new_address?: CreateAddressRequest;
  promotion_id?: number;
}
