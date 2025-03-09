import { PaginationInput } from 'src/common/types/pagination_types/pagination.input';

export interface GetAllBrandInput extends PaginationInput {
  is_active?: boolean;
}
