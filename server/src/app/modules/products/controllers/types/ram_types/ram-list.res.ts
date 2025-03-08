import { PaginationRes } from 'src/common/types/pagination_types/pagination.res';
import { RamRes } from './ram.res';
import { ApiProperty } from '@nestjs/swagger';

export class RamListRes extends PaginationRes {
  @ApiProperty({ type: [RamRes] })
  rams: RamRes[];
}
