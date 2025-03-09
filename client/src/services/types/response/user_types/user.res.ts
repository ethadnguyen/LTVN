export interface UserRes {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: 'admin' | 'user';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
