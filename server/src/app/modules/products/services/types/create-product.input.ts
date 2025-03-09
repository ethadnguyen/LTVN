import { ProductType } from '../../enums/product-type.enum';

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  brand_id: number;
  category_id: number[];
  images?: string[];
  specifications?: object;
  type: ProductType;
  is_active?: boolean;
}
