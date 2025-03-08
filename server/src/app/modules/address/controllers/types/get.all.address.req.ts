import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { IsOptional } from 'class-validator';
import { PaginationReq } from 'src/common/types/pagination_types/pagination.req';

export class GetAllAddressReq extends PaginationReq {
  @ApiPropertyOptional({ description: 'Filter by user id' })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  user_id: number;

  @ApiPropertyOptional({ description: 'Filter by order id' })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  order_id: number;
}
