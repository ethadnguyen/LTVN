import { ApiProperty } from '@nestjs/swagger';
import { StorageType } from '../../../enums/storage-type.enum';
import { CreateProductReq } from '../create-product.req';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateStorageReq extends CreateProductReq {
  @ApiProperty()
  @IsEnum(StorageType)
  storage_type: StorageType;

  @ApiProperty()
  @IsNumber()
  capacity: number;

  @ApiProperty()
  @IsNumber()
  read_speed: number;

  @ApiProperty()
  @IsNumber()
  write_speed: number;

  @ApiProperty()
  @IsString()
  form_factor: string;

  @ApiProperty()
  @IsNumber()
  cache: number;
}
