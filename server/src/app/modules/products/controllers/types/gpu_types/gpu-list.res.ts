import { PaginationRes } from 'src/common/types/pagination_types/pagination.res';
import { GpuRes } from './gpu.res';
import { ApiProperty } from '@nestjs/swagger';

export class GpuListRes extends PaginationRes {
  @ApiProperty({ type: [GpuRes] })
  gpus: GpuRes[];
}
