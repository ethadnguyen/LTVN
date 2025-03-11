import { CreateAddressInput } from 'src/app/modules/address/services/types/create-address.input';
import { OrderStatus } from '../../enums/order-status.enum';

export interface CreateOrderInput {
  order_items: {
    product_id: number;
    quantity: number;
  }[];
  total_price: number;
  phone: string;
  status?: OrderStatus;
  address_id?: number;
  new_address?: CreateAddressInput;
  promotion_id?: number;
}
