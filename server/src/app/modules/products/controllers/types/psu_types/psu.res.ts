import { ApiProperty } from '@nestjs/swagger';
import { ATX12VType } from '../../../enums/atx12-type.enum';
import { ProtectionType } from '../../../enums/protection-type.enum';
import { ProductRes } from '../product.res';

export class PsuRes extends ProductRes {
  @ApiProperty()
  id: number;

  @ApiProperty()
  wattage: number;

  @ApiProperty()
  efficiency_rating: number;

  @ApiProperty()
  form_factor: string;

  @ApiProperty()
  modular: boolean;

  @ApiProperty()
  atx12vVersion: ATX12VType;

  @ApiProperty()
  protection_features: ProtectionType[];

  @ApiProperty()
  pcie_connectors: number;

  @ApiProperty()
  sata_connectors: number;

  @ApiProperty()
  eps_connectors: number;

  @ApiProperty()
  fan_size: number;

  @ApiProperty()
  fan_speed: number;

  @ApiProperty()
  noise_level: number;

  @ApiProperty()
  fan_bearing: string;

  @ApiProperty()
  rgb: boolean;
}
