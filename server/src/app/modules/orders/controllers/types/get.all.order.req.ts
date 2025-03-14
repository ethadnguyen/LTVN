import { PaginationReq } from 'src/common/types/pagination_types/pagination.req';
import { IsOptional, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetAllOrderReq extends PaginationReq {
  @ApiPropertyOptional({ description: 'Filter by user id' })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  user_id: number;
}
