export interface CreateCategoryInput {
  name: string;
  description: string;
  icon?: string;
  parent_id?: number;
  is_active?: boolean;
}
