import { IsEnum, IsNumber, IsString, IsOptional } from 'class-validator';
import { PaymentMethod } from '../../enums/payment-method.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentReq {
  @ApiProperty({ description: 'ID của đơn hàng' })
  @IsNumber()
  order_id: number;

  @ApiProperty({ description: 'Phương thức thanh toán' })
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @ApiProperty({ description: 'Số tiền thanh toán' })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Mã thanh toán (tùy chọn)' })
  @IsString()
  @IsOptional()
  payment_code?: string;
}
