import { PaginationRes } from 'src/common/types/pagination_types/pagination.res';
import { CpuRes } from './cpu.res';
import { ApiProperty } from '@nestjs/swagger';

export class CpuListRes extends PaginationRes {
  @ApiProperty({ type: [CpuRes] })
  cpus: CpuRes[];
}
