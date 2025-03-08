import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { MainboardFormFactor } from '../../../enums/mainboard-type.enum';
import { CreateProductReq } from '../create-product.req';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCaseReq extends CreateProductReq {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  length: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  width: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  height: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  material: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  psu_max_length: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  cpu_cooler_height: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  max_gpu_length: number;

  @ApiProperty()
  @IsArray()
  @IsEnum(MainboardFormFactor, { each: true })
  @IsNotEmpty()
  form_factor: MainboardFormFactor[];
}
