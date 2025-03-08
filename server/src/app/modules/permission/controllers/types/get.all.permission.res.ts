import { ApiProperty } from '@nestjs/swagger';
import { PaginationRes } from 'src/common/types/pagination_types/pagination.res';
import { PermissionRes } from './permission.res';

export class GetAllPermissionRes extends PaginationRes {
  @ApiProperty({ type: [PermissionRes] })
  permissions: PermissionRes[];
}
