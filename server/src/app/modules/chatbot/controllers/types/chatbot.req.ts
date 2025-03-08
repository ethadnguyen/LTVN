import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChatbotReq {
  @ApiProperty({
    description: 'Message from user',
    example: 'Tôi muốn mua laptop',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
