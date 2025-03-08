import { ApiProperty } from '@nestjs/swagger';
import { PaginationRes } from 'src/common/types/pagination_types/pagination.res';
import { ProductRes } from './product.res';

export class ProductListRes extends PaginationRes {
  @ApiProperty({ type: [ProductRes] })
  products: ProductRes[];
}
