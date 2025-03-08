'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cart.store';
import { useAuth } from '@/hooks/useAuth';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  return <>{children}</>;
}
