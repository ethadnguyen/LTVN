import { PaginationRes } from 'src/common/types/pagination_types/pagination.res';
import { StorageRes } from './storage.res';
import { ApiProperty } from '@nestjs/swagger';

export class StorageListRes extends PaginationRes {
  @ApiProperty({ type: [StorageRes] })
  storages: StorageRes[];
}
