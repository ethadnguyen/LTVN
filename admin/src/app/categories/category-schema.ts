import * as z from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục không được để trống'),
  description: z.string().min(1, 'Mô tả không được để trống'),
  parent_id: z.number().nullable().optional(),
  is_active: z.boolean().default(true),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
