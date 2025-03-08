import { ApiProperty } from '@nestjs/swagger';
import { CreateProductReq } from '../create-product.req';
import { IsBoolean, IsEnum, IsNumber, IsString, Min } from 'class-validator';
import { RamType } from '../../../enums/ram-type.enum';
import { ModuleType } from '../../../enums/module-type.enum';
import { ChannelType } from '../../../enums/channel-type.enum';

export class CreateRamReq extends CreateProductReq {
  @ApiProperty()
  @IsEnum(RamType)
  ram_type: RamType;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  speed: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  capacity: number;

  @ApiProperty()
  @IsString()
  latency: string;

  @ApiProperty()
  @IsNumber()
  voltage: number;

  @ApiProperty()
  @IsEnum(ModuleType)
  module_type: ModuleType;

  @ApiProperty()
  @IsBoolean()
  ecc_support: boolean;

  @ApiProperty()
  @IsEnum(ChannelType)
  channel: ChannelType;

  @ApiProperty()
  @IsString()
  timing: string;

  @ApiProperty()
  @IsBoolean()
  rgb: boolean;

  @ApiProperty()
  @IsBoolean()
  heat_spreader: boolean;
}
