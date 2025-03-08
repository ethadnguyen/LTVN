import { MainboardFormFactor } from '../../../enums/mainboard-type.enum';
import { CreateProductInput } from '../create-product.input';

export interface CreateCaseInput extends CreateProductInput {
  length: number;
  width: number;
  height: number;
  color: string;
  material: string;
  psu_max_length: number;
  cpu_cooler_height: number;
  max_gpu_length: number;
  form_factor: MainboardFormFactor[];
}
