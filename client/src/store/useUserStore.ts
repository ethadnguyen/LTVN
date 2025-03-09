import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRes } from '@/services/types/response/user_types/user.res';
import { login } from '@/services/modules/auth.service';
import { getUserById, createUser } from '@/services/modules/user.service';
import { setTokens, removeTokens } from '@/lib/cookies';

interface UserStore {
  user: UserRes | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    phone: string;
  }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,

      login: async (email, password) => {
        try {
          set({ loading: true, error: null });
          const { data: response } = await login({ email, password });

          // Lưu tokens vào cookies
          setTokens(response.access_token, response.refresh_token);

          // Fetch user info
          const userInfo = await getUserById(Number(response.payload.user_id));
          set({ user: userInfo, loading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : 'Đăng nhập thất bại',
            loading: false,
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
          set({ user: userInfo, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Đăng ký thất bại',
            loading: false,
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
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
