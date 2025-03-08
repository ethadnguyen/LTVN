'use client';

import { useDroppable } from '@dnd-kit/core';
import type { ProductCategory, BuilderItem } from '@/types/product';
import { ProductCard } from './product-card';
import { cn } from '@/lib/utils';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BuilderSlotProps {
  category: ProductCategory;
  item?: BuilderItem;
  onQuantityChange?: (quantity: number) => void;
  onRemove?: () => void;
}

export function BuilderSlot({
  category,
  item,
  onQuantityChange,
  onRemove,
}: BuilderSlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: category,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex items-center gap-4 rounded-lg border p-4 transition-colors',
        isOver && 'border-primary bg-muted'
      )}
    >
      <div className='flex-1'>
        {item ? (
          <div className='flex items-center gap-4'>
            <div className='w-40'>
              <ProductCard product={item.product} isDraggable={false} />
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='icon'
                onClick={() =>
                  onQuantityChange?.(Math.max(1, item.quantity - 1))
                }
              >
                <Minus className='h-4 w-4' />
              </Button>
              <span className='w-8 text-center'>{item.quantity}</span>
              <Button
                variant='outline'
                size='icon'
                onClick={() => onQuantityChange?.(item.quantity + 1)}
              >
                <Plus className='h-4 w-4' />
              </Button>
            </div>
            <Button variant='ghost' size='sm' onClick={onRemove}>
              Remove
            </Button>
          </div>
        ) : (
          <div className='text-muted-foreground'>
            Drag and drop a {category} here
          </div>
        )}
      </div>
    </div>
  );
}
