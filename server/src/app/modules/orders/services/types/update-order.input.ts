import { OrderStatus } from '../../enums/order-status.enum';
import { CreateOrderInput } from './create-order.input';

export interface UpdateOrderInput extends Partial<CreateOrderInput> {
  id: number;
  status: OrderStatus;
}
