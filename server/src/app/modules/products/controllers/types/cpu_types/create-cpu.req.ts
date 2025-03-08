import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  Min,
  IsOptional,
  IsEnum,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { CreateProductReq } from '../create-product.req';
import { SocketType } from '../../../enums/socket-type.enum';
import { PcieType } from '../../../enums/pcie-type.enum';
import { ChipsetType } from '../../../enums/chipset-type.enum';
import { RamType } from '../../../enums/ram-type.enum';

export class CreateCpuReq extends CreateProductReq {
  @ApiProperty()
  @IsString()
  socket_type: SocketType;

  @ApiProperty()
  @IsEnum(ChipsetType, { each: true })
  supported_chipsets: ChipsetType[];

  @ApiProperty()
  @IsArray()
  supported_ram: {
    ram_type: RamType;
    max_speed: number;
  }[];

  @ApiProperty()
  @IsNumber()
  @Min(1)
  cores: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  threads: number;

  @ApiProperty()
  @IsString()
  base_clock: string;

  @ApiProperty()
  @IsString()
  boost_clock: string;

  @ApiProperty()
  @IsNumber()
  wattage: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  tdp: number;

  @ApiProperty()
  @IsString()
  cache: string;

  @ApiProperty()
  @IsEnum(PcieType)
  pcie_version: PcieType;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(0)
  pcie_slots?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(0)
  max_memory_capacity?: number;

  @ApiProperty()
  @IsBoolean()
  has_integrated_gpu: boolean;
}
