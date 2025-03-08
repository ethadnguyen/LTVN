'use client';

import Image from 'next/image';
import { useDraggable } from '@dnd-kit/core';
import type { Product } from '@/services/types/response/product_types/product.res';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  isDraggable?: boolean;
}

export function ProductCard({ product, isDraggable = true }: ProductCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: product.id,
      data: { product },
      disabled: !isDraggable,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 999 : undefined,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={cn(
        'group relative rounded-lg border bg-card p-2 hover:border-primary transition-colors touch-none',
        isDragging && 'opacity-50',
        isDraggable && 'cursor-grab active:cursor-grabbing'
      )}
    >
      <div className='aspect-square relative mb-2 overflow-hidden rounded-md'>
        <Image
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          fill
          className='object-cover transition-transform group-hover:scale-105'
        />
      </div>
      <div className='space-y-1'>
        <h3 className='font-medium line-clamp-2 text-sm'>{product.name}</h3>
        <p className='text-sm text-muted-foreground'>
          {formatCurrency(product.price)}
        </p>
      </div>
    </div>
  );
}
