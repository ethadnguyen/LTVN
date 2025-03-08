import { PaginationRes } from '../pagination_types/pagination-res';

export interface CategoryRes {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryListRes extends PaginationRes {
  categories: CategoryRes[];
}
