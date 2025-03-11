'use client';

import { useDroppable } from '@dnd-kit/core';
import type { ReactNode } from 'react';

interface PCBuilderDroppableProps {
  id: string;
  children: ReactNode;
}

export function PCBuilderDroppable({ id, children }: PCBuilderDroppableProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`border-2 border-dashed border-primary/50 rounded-lg p-4 min-h-[100px] transition-all ${
        isOver ? 'border-primary bg-primary/10' : ''
      }`}
    >
      {children}
    </div>
  );
}
