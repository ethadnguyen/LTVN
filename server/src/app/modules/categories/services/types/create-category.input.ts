export interface CreateCategoryInput {
  name: string;
  description: string;
  parent_id?: number;
  is_active?: boolean;
}
