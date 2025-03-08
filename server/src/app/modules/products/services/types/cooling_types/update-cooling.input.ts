import { CreateCoolingInput } from './create-cooling.input';

export interface UpdateCoolingInput extends Partial<CreateCoolingInput> {
  id: number;
}
