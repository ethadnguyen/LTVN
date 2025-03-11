export interface CategoryReq {
  name: string;
  parent_id?: number | null;
  icon?: string;
  description: string;
  is_active: boolean;
}

export interface UpdateCategoryReq extends Partial<CategoryReq> {
  id: number;
}
