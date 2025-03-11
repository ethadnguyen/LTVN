import { z } from 'zod';

export const promotionSchema = z.object({
  name: z.string().min(1, 'Tên khuyến mãi không được để trống'),
  description: z.string().min(1, 'Mô tả không được để trống'),
  discount_type: z.enum(['percentage', 'fixed']),
  discount_value: z.coerce.number().min(0, 'Giá trị giảm giá phải lớn hơn 0'),
  start_date: z.date(),
  end_date: z.date(),
  is_active: z.boolean().default(true),
  usage_limit: z.coerce.number().nullable(),
  minimum_order_amount: z.coerce.number().nullable(),
  maximum_discount_amount: z.coerce.number().nullable(),
  product_ids: z.array(z.number()).optional(),
  category_ids: z.array(z.number()).optional(),
});
