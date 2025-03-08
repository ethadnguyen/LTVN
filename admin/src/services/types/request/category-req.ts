export interface CategoryReq {
  name: string;
  parent_id?: number | null;
  description: string;
  is_active: boolean;
}

export interface UpdateCategoryReq extends CategoryReq {
  id: number;
}
