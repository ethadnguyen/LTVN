import { ApiProperty } from '@nestjs/swagger';
import { UpdateProductReq } from '../update-product.req';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ATX12VType } from '../../../enums/atx12-type.enum';
import { ProtectionType } from '../../../enums/protection-type.enum';
import { MainboardFormFactor } from '../../../enums/mainboard-type.enum';

export class UpdatePsuReq extends UpdateProductReq {
  @ApiProperty()
  @IsNumber()
  wattage?: number;

  @ApiProperty()
  @IsNumber()
  efficiency_rating?: number;

  @ApiProperty()
  @IsEnum(MainboardFormFactor)
  form_factor?: MainboardFormFactor;

  @ApiProperty()
  @IsBoolean()
  modular?: boolean;

  @ApiProperty()
  @IsNumber()
  input_voltage?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  fan_size?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  fan_speed?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  noise_level?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  fan_bearing?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  rgb?: boolean;

  @ApiProperty()
  @IsEnum(ATX12VType)
  @IsOptional()
  atx12vVersion?: ATX12VType;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  pcie_connectors?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  sata_connectors?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  eps_connectors?: number;

  @ApiProperty()
  @IsArray()
  @IsEnum(ProtectionType, { each: true })
  @IsOptional()
  protection_features?: ProtectionType[];
}
