import { OrderStatus } from '../../enums/order-status.enum';
import { PaymentMethod } from '../../enums/payment-method.enum';
import { PaymentStatus } from '../../enums/payment-status.enum';
import { CreateOrderInput } from './create-order.input';

export interface UpdateOrderInput extends Partial<CreateOrderInput> {
  id: number;
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  payment_method?: PaymentMethod;
  paid_at?: Date;
}
