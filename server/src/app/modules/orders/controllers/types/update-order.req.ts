import { IsDate, IsEnum, IsNumber, IsObject } from 'class-validator';
import { IsOptional } from 'class-validator';
import { OrderStatus } from '../../enums/order-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAddressReq } from 'src/app/modules/address/controllers/types/create-address.req';
import { PaymentMethod } from '../../enums/payment-method.enum';
import { PaymentStatus } from '../../enums/payment-status.enum';

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
  @IsNumber()
  @IsOptional()
  promotion_id?: number;

  @ApiProperty()
  @IsObject()
  @IsOptional()
  new_address?: CreateAddressReq;

  @ApiProperty()
  @IsEnum(PaymentMethod)
  @IsOptional()
  payment_method?: PaymentMethod;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  paid_at?: Date;

  @ApiProperty()
  @IsEnum(PaymentStatus)
  @IsOptional()
  payment_status?: PaymentStatus;
}
