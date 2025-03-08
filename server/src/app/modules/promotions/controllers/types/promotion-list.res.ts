import { PaginationRes } from 'src/common/types/pagination_types/pagination.res';
import { PromotionRes } from './promotion.res';
import { ApiProperty } from '@nestjs/swagger';

export class PromotionListRes extends PaginationRes {
  @ApiProperty({ type: [PromotionRes] })
  promotions: PromotionRes[];
}
