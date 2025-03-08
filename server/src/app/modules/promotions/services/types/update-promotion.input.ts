import { CreatePromotionInput } from './create-promotion.input';

export interface UpdatePromotionInput extends Partial<CreatePromotionInput> {
  id: number;
}
