import { PaginationInput } from 'src/common/types/pagination_types/pagination.input';

export interface GetAllCategoryInput extends PaginationInput {
  is_active?: boolean;
}
