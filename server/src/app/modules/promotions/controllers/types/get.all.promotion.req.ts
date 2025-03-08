import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationReq } from 'src/common/types/pagination_types/pagination.req';
import { DiscountType } from '../../enums/discount-type.enum';

export class GetAllPromotionReq extends PaginationReq {
  @ApiPropertyOptional({ description: 'Filter by product id' })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  product_id: number;

  @ApiPropertyOptional({ description: 'Filter by category id' })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  category_id: number;

  @ApiPropertyOptional({ description: 'Filter by discount type' })
  @IsOptional()
  @IsString()
  discount_type: DiscountType;

  @ApiPropertyOptional({ description: 'Filter by start date' })
  @IsOptional()
  @IsDate()
  start_date: Date;

  @ApiPropertyOptional({ description: 'Filter by end date' })
  @IsOptional()
  @IsDate()
  end_date: Date;

  @ApiPropertyOptional({ description: 'Filter by is active' })
  @IsOptional()
  @IsBoolean()
  is_active: boolean;
}
