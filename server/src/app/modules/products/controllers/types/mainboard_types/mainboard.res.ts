import { ApiProperty } from '@nestjs/swagger';
import { ProductRes } from '../product.res';
import { SocketType } from '../../../enums/socket-type.enum';
import { MainboardFormFactor } from '../../../enums/mainboard-type.enum';
import { RamType } from '../../../enums/ram-type.enum';
import { ChipsetType } from '../../../enums/chipset-type.enum';
import { PcieType } from '../../../enums/pcie-type.enum';

export class MainboardRes extends ProductRes {
  @ApiProperty()
  socket_type: SocketType;

  @ApiProperty()
  form_factor: MainboardFormFactor;

  @ApiProperty()
  chipset: ChipsetType;

  @ApiProperty()
  ram_type: RamType;

  @ApiProperty()
  ram_speed: number;

  @ApiProperty()
  ram_slots: number;

  @ApiProperty()
  max_ram_capacity: number;

  @ApiProperty()
  pcie_slots: number;

  @ApiProperty()
  pcie_version: PcieType;

  @ApiProperty()
  m2_slots: number;

  @ApiProperty()
  sata_slots: number;

  @ApiProperty()
  usb_ports: number;

  @ApiProperty()
  rgb: boolean;

  @ApiProperty()
  size: string;

  @ApiProperty({ description: 'Có cổng xuất hình ảnh cho GPU tích hợp' })
  has_video_ports: boolean;
}
