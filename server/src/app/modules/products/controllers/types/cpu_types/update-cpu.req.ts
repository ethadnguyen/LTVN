import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { UpdateProductReq } from '../update-product.req';
import { SocketType } from '../../../enums/socket-type.enum';
import { PcieType } from '../../../enums/pcie-type.enum';
import { ChipsetType } from '../../../enums/chipset-type.enum';
import { RamType } from '../../../enums/ram-type.enum';

export class UpdateCpuReq extends UpdateProductReq {
  @ApiProperty()
  @IsString()
  @IsOptional()
  socket_type?: SocketType;

  @ApiProperty()
  @IsEnum(ChipsetType, { each: true })
  @IsOptional()
  supported_chipsets?: ChipsetType[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  supported_ram?: {
    ram_type: RamType;
    max_speed: number;
  }[];

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsOptional()
  cores?: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsOptional()
  threads?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  base_clock?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  boost_clock?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  wattage?: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @IsOptional()
  tdp?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  cache?: string;

  @ApiProperty()
  @IsEnum(PcieType)
  @IsOptional()
  pcie_version?: PcieType;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @IsOptional()
  pcie_slots?: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @IsOptional()
  max_memory_capacity?: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  has_integrated_gpu?: boolean;
}
