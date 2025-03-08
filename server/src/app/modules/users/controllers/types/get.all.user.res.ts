import { ApiProperty } from '@nestjs/swagger';
import { PaginationRes } from 'src/common/types/pagination_types/pagination.res';
import { UserRes } from './user.res';

export class GetAllUserRes extends PaginationRes {
  @ApiProperty({ type: [UserRes], description: 'List of users' })
  users: UserRes[];
}
