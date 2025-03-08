import { CreateAddressInput } from './create-address.input';

export interface UpdateAddressInput extends Partial<CreateAddressInput> {
  id: number;
}
