import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAddressReq {
  @ApiProperty()
  @IsString()
  place_id: string;

  @ApiProperty()
  @IsString()
  label: string;

  @ApiProperty()
  @IsString()
  province: string;

  @ApiProperty()
  @IsString()
  district: string;

  @ApiProperty()
  @IsString()
  ward: string;

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

  @ApiProperty()
  @IsString()
  @IsOptional()
  street?: string;
}
