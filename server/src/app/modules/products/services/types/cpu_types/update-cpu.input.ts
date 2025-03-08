import { CreateCpuInput } from './create-cpu.input';

export interface UpdateCpuInput extends Partial<CreateCpuInput> {
  id: number;
}
