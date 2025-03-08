import { ApiProperty } from '@nestjs/swagger';
import { ProductRes } from '../product.res';
import { PowerConnectorType } from '../../../enums/power-connector-type.enum';
import { DisplayPortsType } from '../../../enums/displayport-type.enum';
import { MemoryType } from '../../../enums/memory-type.enum';
import { ChipsetType } from '../../../enums/chipset-type.enum';
import { PcieType } from '../../../enums/pcie-type.enum';

export class GpuRes extends ProductRes {
  @ApiProperty()
  chipset: string;

  @ApiProperty()
  memory_size: number;

  @ApiProperty()
  memory_type: MemoryType;

  @ApiProperty()
  min_psu_wattage: number;

  @ApiProperty()
  power_connector: PowerConnectorType;

  @ApiProperty()
  core_clock: string;

  @ApiProperty()
  boost_clock: string;

  @ApiProperty()
  tdp: number;

  @ApiProperty()
  pcie_version: PcieType;

  @ApiProperty()
  slot_size: string;

  @ApiProperty()
  cuda_cores: number;

  @ApiProperty()
  tensor_cores: number;

  @ApiProperty()
  display_ports: DisplayPortsType[];

  @ApiProperty()
  length: number;
}
