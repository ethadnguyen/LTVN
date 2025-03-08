import { ApiProperty } from '@nestjs/swagger';

export class PermissionRes {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}
