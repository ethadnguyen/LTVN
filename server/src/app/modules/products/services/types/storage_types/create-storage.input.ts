import { StorageType } from '../../../enums/storage-type.enum';
import { CreateProductInput } from '../create-product.input';

export interface CreateStorageInput extends CreateProductInput {
  storage_type: StorageType;
  capacity: number;
  read_speed: number;
  write_speed: number;
  form_factor: string;
  cache: number;
}
