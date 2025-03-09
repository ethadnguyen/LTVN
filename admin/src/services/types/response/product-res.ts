import { ProductType } from '../request/product-req';
import { CategoryRes } from './category-res';
import { BrandRes } from './brand-res';

export interface ProductRes {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categories: CategoryRes[];
  images: string[];
  type: ProductType;
  is_active: boolean;
  specifications: Record<string, any>;
  created_at: string;
  updated_at: string;
  brand_id?: number | null;
  brand?: BrandRes | null;
}

export interface CPURes {
  socket: string;
  cores: number;
  threads: number;
  baseClock: number;
  boostClock: number;
  wattage: number;
  tdp: number;
  cache: string;
  pcie_version: string;
  pcie_slots?: number;
  max_memory_capacity: number;
}
