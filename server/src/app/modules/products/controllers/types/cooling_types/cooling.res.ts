import { ApiProperty } from '@nestjs/swagger';
import { ProductRes } from '../product.res';
import { CoolingType } from '../../../enums/cooling-type.enum';
import { SocketType } from '../../../enums/socket-type.enum';

export class CoolingRes extends ProductRes {
  @ApiProperty()
  cooling_type: CoolingType;

  @ApiProperty()
  length: number;

  @ApiProperty()
  width: number;

  @ApiProperty()
  height: number;

  @ApiProperty()
  socket_support: SocketType[];

  @ApiProperty()
  fan_speed: number;

  @ApiProperty()
  noise_level: number;

  @ApiProperty()
  fan_size: number;
}
