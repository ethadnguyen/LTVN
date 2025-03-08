import { CreateGpuInput } from './create-gpu.input';

export interface UpdateGpuInput extends Partial<CreateGpuInput> {
  id: number;
}
