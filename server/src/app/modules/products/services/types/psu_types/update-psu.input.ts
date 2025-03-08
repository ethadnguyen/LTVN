import { CreatePsuInput } from './create-psu.input';

export interface UpdatePsuInput extends Partial<CreatePsuInput> {
  id: number;
}
