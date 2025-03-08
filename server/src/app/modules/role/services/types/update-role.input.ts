import { CreateRoleInput } from './create-role.input';

export interface UpdateRoleInput {
  name: string;
  description?: string;
  permission_ids?: number[];
}
