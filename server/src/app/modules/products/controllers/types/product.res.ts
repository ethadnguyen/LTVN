import { ApiProperty } from '@nestjs/swagger';
import { CategoryRes } from '../../../categories/controllers/types/category.res';
import { ProductType } from '../../enums/product-type.enum';
import { BrandRes } from 'src/app/modules/brand/controllers/types/brand.res';

export class ProductRes {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  stock: number;

  @ApiProperty({ type: [String] })
  images: string[];

  @ApiProperty()
  is_active: boolean;

  @ApiProperty({ type: [CategoryRes] })
  categories: CategoryRes[];

  @ApiProperty({ type: BrandRes })
  brand: BrandRes;

  @ApiProperty({ enum: ProductType })
  type: ProductType;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
