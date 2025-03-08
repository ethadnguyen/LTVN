import { PaginationInput } from 'src/common/types/pagination_types/pagination.input';

export interface GetAllProductInput extends PaginationInput {
  category_id?: number;
  is_active?: boolean;
}
