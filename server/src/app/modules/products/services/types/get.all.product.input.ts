import { PaginationInput } from 'src/common/types/pagination_types/pagination.input';

export interface GetAllProductInput extends PaginationInput {
  category_id?: number;
  is_active?: boolean;
  search?: string;
  min_price?: number;
  max_price?: number;
  is_sale?: boolean;
  min_rating?: number;
  brands?: string;
}
