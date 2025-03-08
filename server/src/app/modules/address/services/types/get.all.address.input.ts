import { PaginationInput } from 'src/common/types/pagination_types/pagination.input';

export interface GetAllAddressInput extends PaginationInput {
  user_id?: number;
  order_id?: number;
}
