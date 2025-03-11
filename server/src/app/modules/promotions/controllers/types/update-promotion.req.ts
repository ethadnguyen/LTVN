import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsNotEmpty } from 'class-validator';
import { DiscountType } from '../../enums/discount-type.enum';

export class UpdatePromotionReq {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty()
  @IsEnum(DiscountType)
  @IsOptional()
  discount_type?: DiscountType;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  discount_value?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  maximum_discount_amount?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  minimum_order_amount?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  usage_limit?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  used_count?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  start_date?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  end_date?: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  products?: number[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  categories?: number[];
}
