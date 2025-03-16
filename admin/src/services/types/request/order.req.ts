export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPING = 'shipping',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface UpdateOrderReq {
  id: number;
  status: OrderStatus;
}
