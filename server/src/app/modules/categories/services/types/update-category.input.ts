import { CreateCategoryInput } from './create-category.input';

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  id: number;
}
