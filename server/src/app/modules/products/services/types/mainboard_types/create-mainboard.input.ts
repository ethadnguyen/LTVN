import { ChipsetType } from '../../../enums/chipset-type.enum';
import { MainboardFormFactor } from '../../../enums/mainboard-type.enum';
import { PcieType } from '../../../enums/pcie-type.enum';
import { RamType } from '../../../enums/ram-type.enum';
import { SocketType } from '../../../enums/socket-type.enum';
import { CreateProductInput } from '../create-product.input';

export interface CreateMainboardInput extends CreateProductInput {
  socket_type: SocketType;
  form_factor: MainboardFormFactor;
  chipset: ChipsetType;
  ram_type: RamType;
  ram_speed: number;
  ram_slots: number;
  max_ram_capacity: number;
  pcie_slots: number;
  pcie_version: PcieType;
  m2_slots: number;
  sata_slots: number;
  usb_ports: number;
  rgb: boolean;
  size: string;
  has_video_ports: boolean;
}
