import { ApiProperty } from '@nestjs/swagger';
import { PaginationRes } from 'src/common/types/pagination_types/pagination.res';
import { CoolingRes } from './cooling.res';

export class CoolingListRes extends PaginationRes {
  @ApiProperty({ type: [CoolingRes] })
  coolings: CoolingRes[];
}
