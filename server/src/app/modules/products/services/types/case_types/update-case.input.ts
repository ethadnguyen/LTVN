import { CreateCaseInput } from './create-case.input';

export interface UpdateCaseInput extends Partial<CreateCaseInput> {
  id: number;
}
