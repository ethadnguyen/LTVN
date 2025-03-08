import { ApiProperty } from '@nestjs/swagger';
import { UpdateProductReq } from './../update-product.req';
import { StorageType } from '../../../enums/storage-type.enum';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateStorageReq extends UpdateProductReq {
  @ApiProperty()
  @IsEnum(StorageType)
  @IsOptional()
  storage_type?: StorageType;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  capacity?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  read_speed?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  write_speed?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  form_factor?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  cache?: number;
}
