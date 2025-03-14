import { PaginationRes } from './pagination-res';

export interface CategoryRes {
  id: number;
  name: string;
  description: string;
  icon?: string;
  is_active: boolean;
  is_sale: boolean;
  products_count: number;
  created_at: string;
  updated_at: string;
  children: CategoryRes[];
  parent: CategoryRes | null;
}

export interface CategoryListRes extends PaginationRes {
  categories: CategoryRes[];
}
