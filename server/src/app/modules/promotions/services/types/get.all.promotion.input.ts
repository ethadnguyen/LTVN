import { PaginationInput } from 'src/common/types/pagination_types/pagination.input';
import { DiscountType } from '../../enums/discount-type.enum';

export interface GetAllPromotionInput extends PaginationInput {
  product_id?: number;
  category_id?: number;
  discount_type?: DiscountType;
  is_active?: boolean;
  start_date?: Date;
  end_date?: Date;
}
