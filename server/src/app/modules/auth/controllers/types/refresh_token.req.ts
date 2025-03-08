import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenReq {
  @ApiProperty()
  @IsString()
  refresh_token: string;
}
