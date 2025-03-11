import { ProductRes } from './product-res';
import { CategoryRes } from './category-res';

export interface PromotionRes {
  id: number;
  name: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  usage_limit: number | null;
  used_count: number;
  minimum_order_amount: number | null;
  maximum_discount_amount: number | null;
  products?: ProductRes[];
  categories?: CategoryRes[];
  created_at: string;
  updated_at: string;
}

export interface PromotionListRes {
  total: number;
  totalPages: number;
  currentPage: number;
  promotions: PromotionRes[];
}
