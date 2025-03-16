import { CreateAddressInput } from 'src/app/modules/address/services/types/create-address.input';
import { OrderStatus } from '../../enums/order-status.enum';
import { PaymentMethod } from '../../enums/payment-method.enum';

export class CreateOrderItemInput {
  product_id: number;
  quantity: number;
}

export class CreateOrderInput {
  order_items: CreateOrderItemInput[];
  total_price: number;
  phone: string;
  status?: OrderStatus;
  address_id?: number;
  new_address?: CreateAddressInput;
  promotion_id?: number;
  user_id?: number;
  payment_method: PaymentMethod;
}
