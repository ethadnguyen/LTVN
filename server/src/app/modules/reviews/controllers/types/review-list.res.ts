import { PaginationRes } from 'src/common/types/pagination_types/pagination.res';
import { ReviewRes } from './review.res';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewListRes extends PaginationRes {
  @ApiProperty({ type: [ReviewRes] })
  reviews: ReviewRes[];
}
