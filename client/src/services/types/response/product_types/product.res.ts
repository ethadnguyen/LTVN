import { CategoryRes } from '../category_types/category.res';
import { ProductType } from '@/services/types/request/product-req';

export type ProductCategory =
  | 'CPU'
  | 'MOTHERBOARD'
  | 'RAM'
  | 'GPU'
  | 'STORAGE'
  | 'PSU'
  | 'CASE'
  | 'COOLING';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  image: string;
  specs: Record<string, any>;
}

export interface ProductRes {
  id: number;
  name: string;
  type: ProductType;
  stock: number;
  price: number;
  category: CategoryRes;
  images: string[];
  specifications: Record<string, string>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BuilderItem {
  product: Product;
  quantity: number;
}

export interface Compatibility {
  isCompatible: boolean;
  messages: string[];
}
