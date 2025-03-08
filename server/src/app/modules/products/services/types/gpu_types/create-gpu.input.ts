import { DisplayPortsType } from '../../../enums/displayport-type.enum';
import { PowerConnectorType } from '../../../enums/power-connector-type.enum';
import { MemoryType } from '../../../enums/memory-type.enum';
import { CreateProductInput } from '../create-product.input';
import { PcieType } from '../../../enums/pcie-type.enum';

export interface CreateGpuInput extends CreateProductInput {
  chipset: string;
  memory_size: number;
  memory_type: MemoryType;
  core_clock: string;
  boost_clock: string;
  min_psu_wattage: number;
  power_connector: PowerConnectorType;
  tdp: number;
  pcie_version: PcieType;
  slot_size: string;
  cuda_cores: number;
  tensor_cores: number;
  display_ports: DisplayPortsType[];
  length: number;
}
