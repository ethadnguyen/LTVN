import { ChannelType } from '../../../enums/channel-type.enum';
import { ModuleType } from '../../../enums/module-type.enum';
import { RamType } from '../../../enums/ram-type.enum';
import { CreateProductInput } from '../create-product.input';

export interface CreateRamInput extends CreateProductInput {
  ram_type: RamType;
  speed: number;
  capacity: number;
  latency: string;
  voltage: number;
  module_type: ModuleType;
  ecc_support: boolean;
  channel: ChannelType;
  timing: string;
  rgb: boolean;
  heat_spreader: boolean;
}
