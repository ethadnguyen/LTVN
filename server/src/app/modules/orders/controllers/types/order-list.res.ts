import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationRes } from 'src/common/types/pagination_types/pagination.res';
import { OrderRes } from './order.res';

export class OrderListRes extends PaginationRes {
  @ApiPropertyOptional({ type: [OrderRes] })
  orders: OrderRes[];
}
