import { ApiProperty } from '@nestjs/swagger';
import { UpdateProductReq } from '../update-product.req';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PowerConnectorType } from '../../../enums/power-connector-type.enum';
import { DisplayPortsType } from '../../../enums/displayport-type.enum';
import { MemoryType } from '../../../enums/memory-type.enum';
import { ChipsetType } from '../../../enums/chipset-type.enum';
import { PcieType } from '../../../enums/pcie-type.enum';

export class UpdateGpuReq extends UpdateProductReq {
  @ApiProperty()
  @IsString()
  @IsOptional()
  chipset?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  memory_size?: number;

  @ApiProperty()
  @IsEnum(MemoryType)
  @IsOptional()
  memory_type?: MemoryType;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  min_psu_wattage?: number;

  @ApiProperty()
  @IsEnum(PowerConnectorType)
  @IsOptional()
  power_connector?: PowerConnectorType;

  @ApiProperty()
  @IsString()
  @IsOptional()
  core_clock?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  boost_clock?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  tdp?: number;

  @ApiProperty()
  @IsEnum(PcieType)
  @IsOptional()
  pcie_version?: PcieType;

  @ApiProperty()
  @IsString()
  @IsOptional()
  slot_size?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  cuda_cores?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  tensor_cores?: number;

  @ApiProperty()
  @IsArray()
  @IsEnum(DisplayPortsType, { each: true })
  @IsOptional()
  display_ports?: DisplayPortsType[];

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  length?: number;
}
