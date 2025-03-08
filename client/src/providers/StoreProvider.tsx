'use client';

import { useRef } from 'react';
import { useUserStore } from '@/store/useUserStore';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initStore = useRef(false);

  if (!initStore.current) {
    useUserStore.getState().getUserFromToken();
    initStore.current = true;
  }

  return <>{children}</>;
}
