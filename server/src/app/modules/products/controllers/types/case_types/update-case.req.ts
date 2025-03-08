import { ApiProperty } from '@nestjs/swagger';
import { UpdateProductReq } from '../update-product.req';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { MainboardFormFactor } from '../../../enums/mainboard-type.enum';

export class UpdateCaseReq extends UpdateProductReq {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  length?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  width?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  height?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  material?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  psu_max_length?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  cpu_cooler_height?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  max_gpu_length?: number;

  @ApiProperty()
  @IsArray()
  @IsEnum(MainboardFormFactor, { each: true })
  @IsOptional()
  form_factor?: MainboardFormFactor[];
}
