import { CreateUserInput } from './create-user.input';

export interface UpdateUserInput extends Partial<CreateUserInput> {
  user_id?: number;
}
