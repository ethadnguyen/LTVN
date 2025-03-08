import { create } from 'zustand';
import { UserState, UserStore, AuthState } from '@/types/user';
import { login } from '@/services/modules/auth.service';
import { accessToken, refreshToken } from '@/constants';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';
import { z } from 'zod';
import { signInSchema } from '@/app/auth/sign-in/sign-in.schema';

const getUserFromToken = (): UserState | null => {
  try {
    const token = getCookie(accessToken);
    if (token) {
      const decoded: UserState = jwtDecode(token as string);
      return decoded;
    }
  } catch (error) {
    console.error('Lỗi giải mã token:', error);
    return null;
  }
  return null;
};

const initialState: AuthState = {
  user: getUserFromToken(),
  loading: false,
  error: null,
};

export const useUserStore = create<UserStore>((set) => ({
  ...initialState,

  login: async (credentials: z.infer<typeof signInSchema>) => {
    try {
      // Bắt đầu loading
      set({ loading: true, error: null });

      console.log('credentials', credentials);
      const validatedCredentials = signInSchema.parse(credentials);
      console.log('validatedCredentials', validatedCredentials);

      const response = await login(validatedCredentials);

      if (response.status === 200) {
        setCookie(accessToken, response.data.access_token, {
          maxAge: 60 * 60 * 24,
          path: '/',
        });
        setCookie(refreshToken, response.data.refresh_token, {
          maxAge: 60 * 60 * 24 * 3,
          path: '/',
        });

        set({
          user: response.data.payload,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      // Xử lý lỗi
      let errorMessage = 'Đăng nhập thất bại';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      set({
        user: null,
        loading: false,
        error: errorMessage,
      });

      throw error; // Re-throw để component có thể xử lý thêm nếu cần
    }
  },

  logout: () => {
    // Xóa tokens
    deleteCookie(accessToken);
    deleteCookie(refreshToken);

    // Reset state
    set({
      ...initialState,
      user: null,
    });
  },

  getUserFromToken,
}));
