import { IsEnum, IsNumber, IsObject } from 'class-validator';
import { IsOptional } from 'class-validator';
import { OrderStatus } from '../../enums/order-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAddressReq } from 'src/app/modules/address/controllers/types/create-address.req';

export class UpdateOrderReq {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  id: number;

  @ApiProperty()
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  address_id?: number;

  @ApiProperty()
  @IsObject()
  @IsOptional()
  new_address?: CreateAddressReq;
}
