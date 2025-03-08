import { ApiProperty } from '@nestjs/swagger';
import { CreateProductReq } from '../create-product.req';
import { MainboardFormFactor } from '../../../enums/mainboard-type.enum';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
import { SocketType } from '../../../enums/socket-type.enum';
import { RamType } from '../../../enums/ram-type.enum';
import { ChipsetType } from '../../../enums/chipset-type.enum';
import { PcieType } from '../../../enums/pcie-type.enum';

export class CreateMainboardReq extends CreateProductReq {
  @ApiProperty()
  @IsEnum(SocketType)
  socket_type: SocketType;

  @ApiProperty()
  @IsEnum(MainboardFormFactor)
  form_factor: MainboardFormFactor;

  @ApiProperty()
  @IsEnum(ChipsetType)
  chipset: ChipsetType;

  @ApiProperty()
  @IsEnum(RamType)
  ram_type: RamType;

  @ApiProperty()
  @IsNumber()
  ram_speed: number;

  @ApiProperty()
  @IsNumber()
  ram_slots: number;

  @ApiProperty()
  @IsNumber()
  max_ram_capacity: number;

  @ApiProperty()
  @IsNumber()
  pcie_slots: number;

  @ApiProperty()
  @IsEnum(PcieType)
  pcie_version: PcieType;

  @ApiProperty()
  @IsNumber()
  m2_slots: number;

  @ApiProperty()
  @IsNumber()
  sata_slots: number;

  @ApiProperty()
  @IsNumber()
  usb_ports: number;

  @ApiProperty()
  @IsBoolean()
  rgb: boolean;

  @ApiProperty()
  @IsString()
  size: string;

  @ApiProperty()
  @IsBoolean()
  has_video_ports: boolean;
}
