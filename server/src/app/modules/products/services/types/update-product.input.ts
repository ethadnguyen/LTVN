import { CreateProductInput } from './create-product.input';

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: number;
}
