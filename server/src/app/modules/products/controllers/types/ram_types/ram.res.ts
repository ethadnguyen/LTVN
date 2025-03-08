import { ApiProperty } from '@nestjs/swagger';
import { RamType } from '../../../enums/ram-type.enum';
import { ProductRes } from '../product.res';
import { ModuleType } from '../../../enums/module-type.enum';
import { ChannelType } from '../../../enums/channel-type.enum';

export class RamRes extends ProductRes {
  @ApiProperty()
  ram_type: RamType;

  @ApiProperty()
  speed: number;

  @ApiProperty()
  capacity: number;

  @ApiProperty()
  latency: string;

  @ApiProperty()
  voltage: number;

  @ApiProperty()
  module_type: ModuleType;

  @ApiProperty()
  ecc_support: boolean;

  @ApiProperty()
  channel: ChannelType;

  @ApiProperty()
  timing: string;

  @ApiProperty()
  rgb: boolean;

  @ApiProperty()
  heat_spreader: boolean;
}
