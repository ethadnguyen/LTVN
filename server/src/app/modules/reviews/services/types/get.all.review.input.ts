import { PaginationInput } from 'src/common/types/pagination_types/pagination.input';

export interface GetAllReviewInput extends PaginationInput {
  product_id?: number;
}
