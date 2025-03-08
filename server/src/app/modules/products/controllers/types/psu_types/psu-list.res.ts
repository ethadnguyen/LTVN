import { ApiProperty } from '@nestjs/swagger';
import { PaginationRes } from 'src/common/types/pagination_types/pagination.res';
import { PsuRes } from './psu.res';

export class PsuListRes extends PaginationRes {
  @ApiProperty({ type: [PsuRes] })
  psus: PsuRes[];
}
