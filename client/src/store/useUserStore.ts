import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRes } from '@/services/types/response/user_types/user.res';
import { login } from '@/services/modules/auth.service';
import { getUserById, createUser } from '@/services/modules/user.service';
import { setTokens, removeTokens } from '@/lib/cookies';
import { getCookie } from 'cookies-next';
import { accessToken } from '@/constants';
import { jwtDecode } from 'jwt-decode';

interface UserStore {
  user: UserRes | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    phone: string;
  }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  checkAuth: () => Promise<boolean>;
}

interface JwtPayload {
  user_id: string;
  exp: number;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          set({ loading: true, error: null });
          const { data: response } = await login({ email, password });

          // Lưu tokens vào cookies
          setTokens(response.access_token, response.refresh_token);

          // Fetch user info
          const userInfo = await getUserById(Number(response.payload.user_id));
          set({ user: userInfo, loading: false, isAuthenticated: true });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : 'Đăng nhập thất bại',
            loading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      register: async (data) => {
        try {
          set({ loading: true, error: null });

          // Tạo user mới
          await createUser(data);

          // Đăng nhập sau khi tạo user thành công
          const { data: response } = await login({
            email: data.email,
            password: data.password,
          });

          // Lưu tokens vào cookies
          setTokens(response.access_token, response.refresh_token);

          // Fetch user info
          const userInfo = await getUserById(Number(response.payload.user_id));
          set({ user: userInfo, loading: false, isAuthenticated: true });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Đăng ký thất bại',
            loading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: () => {
        // Xóa tokens khỏi cookies
        removeTokens();

        set({
          user: null,
          error: null,
          isAuthenticated: false,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: async () => {
        try {
          const token = getCookie(accessToken);

          if (!token) {
            set({ isAuthenticated: false, user: null });
            return false;
          }

          // Kiểm tra token có hợp lệ không
          try {
            const decoded = jwtDecode<JwtPayload>(token as string);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
              // Token đã hết hạn
              set({ isAuthenticated: false, user: null });
              removeTokens();
              return false;
            }

            // Token hợp lệ, tải thông tin người dùng nếu chưa có
            if (!get().user) {
              const userInfo = await getUserById(Number(decoded.user_id));
              set({ user: userInfo, isAuthenticated: true });
            } else {
              set({ isAuthenticated: true });
            }

            return true;
          } catch (_error) {
            // Token không hợp lệ
            set({ isAuthenticated: false, user: null });
            removeTokens();
            return false;
          }
        } catch (_error) {
          set({ isAuthenticated: false, user: null });
          return false;
        }
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
