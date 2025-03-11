import { UserRes } from '../user_types/user.res';
import { ProductRes } from '../product_types/product.res';

export interface ReviewRes {
  id: number;
  rating: number;
  comment: string;
  user: UserRes;
  product: ProductRes;
  created_at: string;
  updated_at: string;
}
