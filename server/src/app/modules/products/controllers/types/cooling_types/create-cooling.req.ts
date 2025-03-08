import { ApiProperty } from '@nestjs/swagger';
import { CreateProductReq } from '../create-product.req';
import { CoolingType } from '../../../enums/cooling-type.enum';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';
import { SocketType } from '../../../enums/socket-type.enum';

export class CreateCoolingReq extends CreateProductReq {
  @ApiProperty()
  @IsEnum(CoolingType)
  cooling_type: CoolingType;

  @ApiProperty()
  @IsNumber()
  length: number;

  @ApiProperty()
  @IsNumber()
  width: number;

  @ApiProperty()
  @IsNumber()
  height: number;

  @ApiProperty()
  @IsArray()
  @IsEnum(SocketType, { each: true })
  socket_support: SocketType[];

  @ApiProperty()
  @IsNumber()
  fan_speed: number;

  @ApiProperty()
  @IsNumber()
  noise_level: number;

  @ApiProperty()
  @IsNumber()
  fan_size: number;
}
