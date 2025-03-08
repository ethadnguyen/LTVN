import { ATX12VType } from '../../../enums/atx12-type.enum';
import { MainboardFormFactor } from '../../../enums/mainboard-type.enum';
import { ProtectionType } from '../../../enums/protection-type.enum';
import { CreateProductInput } from '../create-product.input';

export interface CreatePsuInput extends CreateProductInput {
  wattage: number;
  efficiency_rating: number;
  form_factor: MainboardFormFactor;
  modular: boolean;
  input_voltage: number;
  fan_size?: number;
  fan_speed?: number;
  noise_level?: number;
  fan_bearing?: string;
  rgb?: boolean;
  atx12v_version: ATX12VType;
  protection_features?: ProtectionType[];
  pcie_connectors?: number;
  sata_connectors?: number;
  eps_connectors?: number;
}
