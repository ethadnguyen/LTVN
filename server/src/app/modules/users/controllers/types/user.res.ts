import { ApiProperty } from '@nestjs/swagger';
import { StatusUser } from 'src/common/enum/user.enum';
import { Role } from './../../../role/entities/role.entity';

export class UserRes {
  @ApiProperty()
  user_id: number;

  @ApiProperty()
  user_name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  status: StatusUser;

  @ApiProperty()
  role: Role;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
