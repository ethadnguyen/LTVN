import { PaginationRes } from '../pagination_types/pagination-res';
import { ReviewRes } from './review.res';

export interface ReviewListRes extends PaginationRes {
  reviews: ReviewRes[];
}
