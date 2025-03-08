import { CreateReviewInput } from './create-review.input';

export interface UpdateReviewInput extends Partial<CreateReviewInput> {
  id: number;
}
