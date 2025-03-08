import { CreateStorageInput } from './create-storage.input';

export interface UpdateStorageInput extends Partial<CreateStorageInput> {
  id: number;
}
