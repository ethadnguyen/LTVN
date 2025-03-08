import { ApiProperty } from '@nestjs/swagger';
import { DiscountType } from '../../enums/discount-type.enum';
import { ProductRes } from 'src/app/modules/products/controllers/types/product.res';
import { CategoryRes } from 'src/app/modules/categories/controllers/types/category.res';

export class PromotionRes {
  @ApiProperty({ description: 'Mã khuyến mãi' })
  id: number;

  @ApiProperty({ description: 'Tên khuyến mãi' })
  name: string;

  @ApiProperty({ description: 'Mô tả' })
  description: string;

  @ApiProperty({ description: 'Ngày bắt đầu' })
  start_date: Date;

  @ApiProperty({ description: 'Ngày kết thúc' })
  end_date: Date;

  @ApiProperty({ description: 'Trạng thái' })
  is_active: boolean;

  @ApiProperty({ description: 'Loại khuyến mãi' })
  discount_type: DiscountType;

  @ApiProperty({ description: 'Giá trị khuyến mãi' })
  discount_value: number;

  @ApiProperty({ description: 'Số lượng sử dụng' })
  usage_count: number;

  @ApiProperty({ description: 'Số lượng sử dụng tối đa' })
  usage_limit: number;

  @ApiProperty({ description: 'Số tiền tối thiểu để áp dụng khuyến mãi' })
  minimum_order_amount: number;

  @ApiProperty({ description: 'Số tiền tối đa giảm giá' })
  maximum_discount_amount: number;

  @ApiProperty({ description: 'Danh sách sản phẩm đang áp dụng khuyến mãi' })
  products: ProductRes[];

  @ApiProperty({ description: 'Danh sách danh mục đang áp dụng khuyến mãi' })
  categories: CategoryRes[];

  @ApiProperty({ description: 'Ngày tạo' })
  created_at: Date;

  @ApiProperty({ description: 'Ngày cập nhật' })
  updated_at: Date;
}
