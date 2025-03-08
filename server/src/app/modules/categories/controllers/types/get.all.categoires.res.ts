import { ApiProperty } from '@nestjs/swagger';
import { PaginationRes } from 'src/common/types/pagination_types/pagination.res';
import { CategoryRes } from './category.res';

export class GetAllCategoriesRes extends PaginationRes {
  @ApiProperty({ type: [CategoryRes] })
  categories: CategoryRes[];
}
