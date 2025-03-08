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
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
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
  @IsDate()
  @IsOptional()
  start_date?: Date;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  end_date?: Date;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  products?: number[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  categories?: number[];
}
