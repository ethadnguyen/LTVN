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
