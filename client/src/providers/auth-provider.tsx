'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { useCartStore } from '@/store/useCartStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth, isAuthenticated } = useUserStore();
  const { fetchCart } = useCartStore();

  useEffect(() => {
    const initAuth = async () => {
      const isLoggedIn = await checkAuth();

      // Nếu đã đăng nhập, tải giỏ hàng
      if (isLoggedIn) {
        fetchCart().catch(console.error);
      }
    };

    initAuth();
  }, [checkAuth, fetchCart]);

  return <>{children}</>;
}
