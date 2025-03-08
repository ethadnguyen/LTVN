import { ApiProperty } from '@nestjs/swagger';
import { ProductRes } from '../product.res';
import { SocketType } from '../../../enums/socket-type.enum';
import { ChipsetType } from '../../../enums/chipset-type.enum';
import { RamType } from '../../../enums/ram-type.enum';

export class CpuRes extends ProductRes {
  @ApiProperty()
  socket_type: SocketType;

  @ApiProperty()
  supported_chipsets: ChipsetType[];

  @ApiProperty()
  supported_ram: {
    ram_type: RamType;
    max_speed: number;
  }[];

  @ApiProperty()
  cores: number;

  @ApiProperty()
  threads: number;

  @ApiProperty()
  baseClock: string;

  @ApiProperty()
  boostClock: string;

  @ApiProperty()
  wattage: string;

  @ApiProperty()
  tdp: number;

  @ApiProperty()
  cache: string;

  @ApiProperty()
  pcie_version: string;

  @ApiProperty()
  pcie_slots: number;

  @ApiProperty()
  max_memory_capacity: number;

  @ApiProperty()
  has_integrated_gpu: boolean;
}
