export interface CreateBrandReq {
  name: string;
  description?: string;
  is_active?: boolean;
}

export interface UpdateBrandReq {
  id: number;
  name?: string;
  description?: string;
  is_active?: boolean;
}
