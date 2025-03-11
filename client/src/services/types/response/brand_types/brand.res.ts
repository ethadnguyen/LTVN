import { PaginationRes } from '../pagination_types/pagination-res';

export interface BrandRes {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BrandListRes extends PaginationRes {
  brands: BrandRes[];
}
