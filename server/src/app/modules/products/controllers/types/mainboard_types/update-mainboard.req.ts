import { ApiProperty } from '@nestjs/swagger';
import { UpdateProductReq } from '../update-product.req';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { MainboardFormFactor } from '../../../enums/mainboard-type.enum';
import { SocketType } from '../../../enums/socket-type.enum';
import { RamType } from '../../../enums/ram-type.enum';
import { ChipsetType } from '../../../enums/chipset-type.enum';
import { PcieType } from '../../../enums/pcie-type.enum';

export class UpdateMainboardReq extends UpdateProductReq {
  @ApiProperty()
  @IsEnum(SocketType)
  @IsOptional()
  socket_type?: SocketType;

  @ApiProperty()
  @IsEnum(MainboardFormFactor)
  @IsOptional()
  form_factor?: MainboardFormFactor;

  @ApiProperty()
  @IsEnum(ChipsetType)
  @IsOptional()
  chipset?: ChipsetType;

  @ApiProperty()
  @IsEnum(RamType)
  @IsOptional()
  ram_type?: RamType;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  ram_speed?: number;

  @ApiProperty()
  @IsNumber()
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  max_ram_capacity?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  pcie_slots?: number;

  @ApiProperty()
  @IsEnum(PcieType)
  @IsOptional()
  pcie_version?: PcieType;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  m2_slots?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  sata_slots?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  usb_ports?: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  rgb?: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  size?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  has_video_ports?: boolean;
}
