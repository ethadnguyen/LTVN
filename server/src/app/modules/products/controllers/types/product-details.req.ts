import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CpuDetailsReq {
  @ApiProperty()
  @IsString()
  socketType: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  cores: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  threads: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  baseClock: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  boostClock: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  tdp: number;

  @ApiProperty()
  @IsString()
  cache: string;
}

export class GpuDetailsReq {
  @ApiProperty()
  @IsString()
  chipset: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  memorySize: number;

  // ... thêm các trường khác của GPU
}
