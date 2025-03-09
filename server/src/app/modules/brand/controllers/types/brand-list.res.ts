import { PaginationRes } from 'src/common/types/pagination_types/pagination.res';
import { BrandRes } from './brand.res';
import { ApiProperty } from '@nestjs/swagger';

export class BrandListRes extends PaginationRes {
  @ApiProperty({ type: [BrandRes] })
  brands: BrandRes[];
}
