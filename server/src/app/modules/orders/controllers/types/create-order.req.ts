import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsArray } from 'class-validator';
import { CreateOrderItemReq } from './create-order-item.req';
import { OrderStatus } from '../../enums/order-status.enum';
import { CreateAddressReq } from 'src/app/modules/address/controllers/types/create-address.req';

export class CreateOrderReq {
  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemReq)
  order_items: CreateOrderItemReq[];

  @ApiProperty()
  @IsNumber()
  total_price: number;

  @ApiProperty()
  @IsString()
  phone: string;

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
