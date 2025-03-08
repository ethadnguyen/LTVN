import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { IsOptional } from 'class-validator';
import { PaginationReq } from 'src/common/types/pagination_types/pagination.req';

export class GetAllReviewReq extends PaginationReq {
  @ApiPropertyOptional({ description: 'Filter by product id' })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  product_id: number;
}
