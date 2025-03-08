import { PaginationRes } from 'src/common/types/pagination_types/pagination.res';
import { RoleRes } from './role.res';
import { ApiProperty } from '@nestjs/swagger';

export class GetAllRoleRes extends PaginationRes {
  @ApiProperty({ type: [RoleRes] })
  roles: RoleRes[];
}
