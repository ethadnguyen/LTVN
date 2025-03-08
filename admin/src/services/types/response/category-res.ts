import { PaginationRes } from './pagination-res';

export interface CategoryRes {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  children: CategoryRes[];
  parent: CategoryRes | null;
}

export interface CategoryListRes extends PaginationRes {
  categories: CategoryRes[];
}
