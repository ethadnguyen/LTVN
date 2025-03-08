import { ApiProperty } from '@nestjs/swagger';
import { PermissionRes } from 'src/app/modules/permission/controllers/types/permission.res';

export class RoleRes {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  permissions: PermissionRes[];
}
