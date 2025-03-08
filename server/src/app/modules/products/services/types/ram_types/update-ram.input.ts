import { CreateRamInput } from './create-ram.input';

export interface UpdateRamInput extends Partial<CreateRamInput> {
  id: number;
}
