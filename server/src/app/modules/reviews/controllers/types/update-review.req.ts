import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateReviewReq {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  rating?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  comment?: string;
}
