import { MainboardRes } from './mainboard.res';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationRes } from 'src/common/types/pagination_types/pagination.res';

export class MainboardListRes extends PaginationRes {
  @ApiProperty({ type: [MainboardRes] })
  mainboards: MainboardRes[];
}
