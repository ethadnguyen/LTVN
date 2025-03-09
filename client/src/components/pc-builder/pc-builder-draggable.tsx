'use client';

import { useDraggable } from '@dnd-kit/core';
import type { ReactNode } from 'react';

interface PCBuilderDraggableProps {
  id: string;
  children: ReactNode;
}

export function PCBuilderDraggable({ id, children }: PCBuilderDraggableProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className='cursor-grab active:cursor-grabbing'
    >
      {children}
    </div>
  );
}
