import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAddressReq {
  @ApiProperty()
  @IsString()
  place_id: string;

  @ApiProperty()
  @IsNumber()
  user_id: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  order_id?: number;

  @ApiProperty()
  @IsString()
  note: string;
}
