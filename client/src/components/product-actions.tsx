'use client';

import { Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface ProductActionsProps {
  price: number;
  rating: number;
  onAddToWishlist: () => void;
  onBuyNow: () => void;
  onAddToCart: () => void;
}

export function ProductActions({
  price,
  rating,
  onAddToWishlist,
  onBuyNow,
  onAddToCart,
}: ProductActionsProps) {
  return (
    <div className='space-y-6'>
      <div className='text-3xl font-bold'>{formatCurrency(price)}</div>

      <div className='flex gap-0.5'>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < rating ? 'fill-primary' : 'fill-muted stroke-muted-foreground'
            }`}
          />
        ))}
      </div>

      <div className='flex flex-wrap gap-4'>
        <Button variant='outline' className='flex-1' onClick={onAddToWishlist}>
          <Heart className='mr-2 h-4 w-4' />
          Add to wishlist
        </Button>
        <Button className='flex-1' onClick={onBuyNow}>
          Buy now
        </Button>
        <Button variant='secondary' className='flex-1' onClick={onAddToCart}>
          Add to cart
        </Button>
      </div>
    </div>
  );
}
