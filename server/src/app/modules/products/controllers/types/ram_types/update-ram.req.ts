import { ApiProperty } from '@nestjs/swagger';
import { UpdateProductReq } from '../update-product.req';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { RamType } from '../../../enums/ram-type.enum';
import { ModuleType } from '../../../enums/module-type.enum';
import { ChannelType } from '../../../enums/channel-type.enum';

export class UpdateRamReq extends UpdateProductReq {
  @ApiProperty()
  @IsEnum(RamType)
  @IsOptional()
  ram_type?: RamType;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsOptional()
  speed?: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  latency?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @IsOptional()
  voltage?: number;

  @ApiProperty()
  @IsEnum(ModuleType)
  @IsOptional()
  module_type?: ModuleType;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  ecc_support?: boolean;

  @ApiProperty()
  @IsEnum(ChannelType)
  @IsOptional()
  channel?: ChannelType;

  @ApiProperty()
  @IsString()
  @IsOptional()
  timing?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  rgb?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  heat_spreader?: boolean;
}
