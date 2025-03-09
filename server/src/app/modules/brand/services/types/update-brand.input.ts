import { CreateBrandInput } from './create-brand.input';

export interface UpdateBrandInput extends Partial<CreateBrandInput> {
  id: number;
}
