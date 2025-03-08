import { ApiProperty } from '@nestjs/swagger';
import { StorageType } from '../../../enums/storage-type.enum';
import { ProductRes } from '../product.res';

export class StorageRes extends ProductRes {
  @ApiProperty()
  storage_type: StorageType;

  @ApiProperty()
  capacity: number;

  @ApiProperty()
  read_speed: number;

  @ApiProperty()
  write_speed: number;

  @ApiProperty()
  form_factor: string;

  @ApiProperty()
  cache: number;
}
