import { ApiProperty } from '@nestjs/swagger';
import { PaginationRes } from 'src/common/types/pagination_types/pagination.res';
import { CaseRes } from './case.res';

export class CaseListRes extends PaginationRes {
  @ApiProperty({ type: [CaseRes] })
  cases: CaseRes[];
}
