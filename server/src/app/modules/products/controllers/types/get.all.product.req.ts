import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationReq } from 'src/common/types/pagination_types/pagination.req';

export class GetAllProductReq extends PaginationReq {
  @ApiPropertyOptional({ description: 'Filter by category id' })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  category_id: number;

  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  is_active?: boolean;

  @ApiPropertyOptional({ description: 'Filter by search' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by min price' })
  @IsOptional()
  @IsNumber()
  @Transform(
    ({ value }) => {
      if (value === undefined || value === '') return undefined;
      return Number(value);
    },
    { toClassOnly: true },
  )
  min_price?: number;

  @ApiPropertyOptional({ description: 'Filter by max price' })
  @IsOptional()
  @IsNumber()
  @Transform(
    ({ value }) => {
      if (value === undefined || value === '') return undefined;
      return Number(value);
    },
    { toClassOnly: true },
  )
  max_price?: number;

  @ApiPropertyOptional({ description: 'Filter by is sale' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === true) return true;
    if (value === false) return false;
    return undefined;
  })
  is_sale?: boolean;

  @ApiPropertyOptional({ description: 'Filter by min rating' })
  @IsOptional()
  @IsNumber()
  @Transform(
    ({ value }) => {
      if (value === undefined || value === '') return undefined;
      return Number(value);
    },
    { toClassOnly: true },
  )
  min_rating?: number;

  @ApiPropertyOptional({ description: 'Filter by brands' })
  @IsOptional()
  @IsString()
  brands?: string;
}
