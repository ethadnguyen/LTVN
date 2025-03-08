import { DiscountType } from '../../enums/discount-type.enum';

export interface CreatePromotionInput {
  name: string;
  description: string;
  discount_type: DiscountType;
  discount_value: number;
  start_date: Date;
  end_date: Date;
  is_active?: boolean;
  usage_limit: number;
  used_count?: number;
  minimum_order_amount: number;
  maximum_discount_amount: number;
  product_ids: number[];
  category_ids: number[];
}
