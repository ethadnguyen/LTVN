import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { MainboardFormFactor } from '../../../enums/mainboard-type.enum';
import { IsEnum } from 'class-validator';
import { ProductRes } from '../product.res';

export class CaseRes extends ProductRes {
  @ApiProperty()
  @IsNumber()
  length: number;

  @ApiProperty()
  @IsNumber()
  width: number;

  @ApiProperty()
  @IsNumber()
  height: number;

  @ApiProperty()
  @IsString()
  color: string;

  @ApiProperty()
  @IsString()
  material: string;

  @ApiProperty()
  @IsNumber()
  psu_max_length: number;

  @ApiProperty()
  @IsNumber()
  cpu_cooler_height: number;

  @ApiProperty()
  @IsNumber()
  max_gpu_length: number;

  @ApiProperty()
  @IsArray()
  @IsEnum(MainboardFormFactor, { each: true })
  form_factor: MainboardFormFactor[];
}
