import {
  IsEnum,
  IsNumber,
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { PaymentMethod } from '../../enums/payment-method.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentReq {
  @ApiProperty({ description: 'ID của đơn hàng' })
  @IsNotEmpty()
  @IsNumber()
  order_id: number;

  @ApiProperty({ description: 'Phương thức thanh toán' })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @ApiProperty({ description: 'Số tiền thanh toán' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Mã thanh toán (tùy chọn)' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'URL hủy bỏ' })
  @IsOptional()
  @IsString()
  cancel_url?: string;

  @ApiProperty({ description: 'URL trở về' })
  @IsOptional()
  @IsString()
  return_url?: string;
}
