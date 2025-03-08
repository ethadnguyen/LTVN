import { ApiProperty } from '@nestjs/swagger';
import { CreateProductReq } from '../create-product.req';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';
import { PowerConnectorType } from '../../../enums/power-connector-type.enum';
import { DisplayPortsType } from '../../../enums/displayport-type.enum';
import { MemoryType } from '../../../enums/memory-type.enum';
import { ChipsetType } from '../../../enums/chipset-type.enum';
import { PcieType } from '../../../enums/pcie-type.enum';

export class CreateGpuReq extends CreateProductReq {
  @ApiProperty()
  @IsString()
  chipset: string;

  @ApiProperty()
  @IsNumber()
  memory_size: number;

  @ApiProperty()
  @IsEnum(MemoryType)
  memory_type: MemoryType;

  @ApiProperty()
  @IsNumber()
  min_psu_wattage: number;

  @ApiProperty()
  @IsEnum(PowerConnectorType)
  power_connector: PowerConnectorType;

  @ApiProperty()
  @IsString()
  core_clock: string;

  @ApiProperty()
  @IsString()
  boost_clock: string;

  @ApiProperty()
  @IsNumber()
  tdp: number;

  @ApiProperty()
  @IsEnum(PcieType)
  pcie_version: PcieType;

  @ApiProperty()
  @IsString()
  slot_size: string;

  @ApiProperty()
  @IsNumber()
  cuda_cores: number;

  @ApiProperty()
  @IsNumber()
  tensor_cores: number;

  @ApiProperty()
  @IsArray()
  @IsEnum(DisplayPortsType, { each: true })
  display_ports: DisplayPortsType[];

  @ApiProperty()
  @IsNumber()
  length: number;
}
