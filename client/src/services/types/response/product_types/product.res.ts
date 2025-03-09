import { CategoryRes } from '../category_types/category.res';
import { PaginationRes } from '../pagination_types/pagination-res';

export const enum ProductType {
  CPU = 'CPU',
  MAINBOARD = 'MAINBOARD',
  RAM = 'RAM',
  GPU = 'GPU',
  STORAGE = 'STORAGE',
  POWER_SUPPLY = 'POWER_SUPPLY',
  CASE = 'CASE',
  COOLING = 'COOLING',
}

export interface ProductRes {
  id: number;
  name: string;
  type: ProductType;
  slug: string;
  stock: number;
  price: number;
  category: CategoryRes;
  images: string[];
  specifications: Record<string, string>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductListRes extends PaginationRes {
  products: ProductRes[];
}
