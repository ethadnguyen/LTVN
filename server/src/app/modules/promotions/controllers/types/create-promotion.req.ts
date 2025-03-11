import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsDate,
  IsArray,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { DiscountType } from '../../enums/discount-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePromotionReq {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsEnum(DiscountType)
  @IsNotEmpty()
  discount_type: DiscountType;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  discount_value: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  start_date: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  end_date: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty()
  @IsNumber()
  usage_limit: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  used_count?: number;

  @ApiProperty()
  @IsNumber()
  minimum_order_amount: number;

  @ApiProperty()
  @IsNumber()
  maximum_discount_amount: number;

  @ApiProperty()
  @IsArray()
  product_ids: number[];

  @ApiProperty()
  @IsArray()
  category_ids: number[];
}
