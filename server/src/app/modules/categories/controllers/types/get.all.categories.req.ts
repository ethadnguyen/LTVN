import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationReq } from 'src/common/types/pagination_types/pagination.req';

export class GetAllCategoriesReq extends PaginationReq {
  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  is_active?: boolean;
}
