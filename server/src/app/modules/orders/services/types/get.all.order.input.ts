import { PaginationInput } from 'src/common/types/pagination_types/pagination.input';

export interface GetAllOrderInput extends PaginationInput {
  user_id?: number;
  status?: string;
  searchAddress?: string;
}
