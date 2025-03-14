import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAddressReq {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  place_id?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  label?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  province?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  district?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  user_id?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  order_id?: number;
}
