export interface UserRes {
  user_id: number;
  email: string;
  user_name: string;
  phone: string;
  role: 'admin' | 'user';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
