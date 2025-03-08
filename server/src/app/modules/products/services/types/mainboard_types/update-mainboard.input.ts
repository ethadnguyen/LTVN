import { CreateMainboardInput } from './create-mainboard.input';

export interface UpdateMainboardInput extends Partial<CreateMainboardInput> {
  id: number;
}
