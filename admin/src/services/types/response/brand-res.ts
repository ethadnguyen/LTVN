export interface BrandRes {
  id: number;
  name: string;
  description: string | null;
  slug: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
