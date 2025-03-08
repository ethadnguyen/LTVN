import { StatusUser } from 'src/common/enum/user.enum';

export interface CreateUserInput {
  user_name: string;
  password: string;
  phone: string;
  email: string;
  status?: StatusUser;
  roles?: string[];
}
