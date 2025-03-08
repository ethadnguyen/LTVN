import { ChipsetType } from '../../../enums/chipset-type.enum';
import { PcieType } from '../../../enums/pcie-type.enum';
import { RamType } from '../../../enums/ram-type.enum';
import { SocketType } from '../../../enums/socket-type.enum';
import { CreateProductInput } from '../create-product.input';

export interface CreateCpuInput extends CreateProductInput {
  socket_type: SocketType;
  supported_chipsets: ChipsetType[];
  supported_ram: {
    ram_type: RamType;
    max_speed: number;
  }[];
  cores: number;
  threads: number;
  base_clock: string;
  boost_clock: string;
  wattage: number;
  tdp: number;
  cache: string;
  pcie_version: PcieType;
  pcie_slots?: number;
  max_memory_capacity?: number;
  has_integrated_gpu: boolean;
}
