import { z } from 'zod';
import { signInSchema } from '@/app/auth/sign-in/sign-in.schema';

export interface UserState {
  token_id: string;
  user_id: number;
  user_name: string;
  email?: string;
  roles: string[];
  permissions: string[];
}

export interface AuthState {
  user: UserState | null;
  loading: boolean;
  error: string | null;
}

export interface UserStore extends AuthState {
  login: (credentials: z.infer<typeof signInSchema>) => Promise<void>;
  logout: () => void;
  getUserFromToken: () => UserState | null;
}
