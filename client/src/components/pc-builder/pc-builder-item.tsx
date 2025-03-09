'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Component {
  id: string;
  type: string;
  name: string;
  image: string;
  price: number;
  compatibility: string[];
}

interface PCBuilderItemProps {
  component: Component;
  onRemove: () => void;
}

export function PCBuilderItem({ component, onRemove }: PCBuilderItemProps) {
  return (
    <div className='flex items-center justify-between gap-2 rounded-md border bg-card p-2'>
      <div className='flex items-center gap-2'>
        <div className='relative h-12 w-12 shrink-0'>
          <img
            src={component.image || '/placeholder.svg'}
            alt={component.name}
            className='object-cover rounded-md'
          />
        </div>
        <div>
          <p className='text-sm font-medium'>{component.name}</p>
          <p className='text-xs text-muted-foreground'>
            {component.price.toLocaleString()}đ
          </p>
        </div>
      </div>
      <Button
        variant='ghost'
        size='icon'
        className='h-8 w-8 shrink-0'
        onClick={onRemove}
      >
        <X className='h-4 w-4' />
        <span className='sr-only'>Xóa</span>
      </Button>
    </div>
  );
}
