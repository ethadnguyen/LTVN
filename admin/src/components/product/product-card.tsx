'use client';

import { cn, formatCurrency } from '@/lib/utils';
import { ProductRes } from '@/services/types/response/product-res';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ProductCardProps {
  product: ProductRes;
  className?: string;
  onClick?: () => void;
}

export function ProductCard({ product, className, onClick }: ProductCardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [formattedPrice, setFormattedPrice] = useState('');

  useEffect(() => {
    setIsMounted(true);
    setFormattedPrice(formatCurrency(product.price));
  }, [product.price]);

  // Trả về skeleton hoặc phiên bản đơn giản khi chưa mounted
  if (!isMounted) {
    return (
      <Card
        className={cn(
          'overflow-hidden cursor-pointer hover:shadow-lg transition-shadow',
          className
        )}
      >
        <div className='relative aspect-square bg-muted'></div>
        <CardContent className='p-4'>
          <div className='h-6 bg-muted rounded mb-2'></div>
          <div className='h-4 bg-muted rounded mb-2'></div>
          <div className='h-4 bg-muted rounded mb-2 w-3/4'></div>
          <div className='flex justify-between items-center'>
            <div className='h-5 bg-muted rounded w-1/3'></div>
            <div className='h-5 bg-muted rounded w-1/4'></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'overflow-hidden cursor-pointer hover:shadow-lg transition-shadow',
        className
      )}
      onClick={onClick}
    >
      <div className='relative aspect-square'>
        <Image
          src={
            product.images?.[0] || 'https://placehold.co/400x400?text=No+Image'
          }
          alt={product.name}
          fill
          unoptimized
          className='object-cover'
        />
        <Badge
          variant={product.is_active ? 'default' : 'secondary'}
          className='absolute top-2 right-2'
        >
          {product.is_active ? 'Đang bán' : 'Ngừng bán'}
        </Badge>
      </div>
      <CardContent className='p-4'>
        <h3 className='font-semibold text-lg line-clamp-2 mb-2'>
          {product.name}
        </h3>
        <p className='text-gray-600 text-sm mb-2 line-clamp-2'>
          {product.description}
        </p>
        <div className='space-y-2'>
          <div className='flex justify-between items-center'>
            <p className='text-primary font-medium'>{formattedPrice}</p>
            <p className='text-gray-600 text-sm'>
              Còn {product.stock} sản phẩm
            </p>
          </div>

          <div className='pt-2 border-t border-gray-100 space-y-1'>
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <Tag className='w-4 h-4' />
              <div className='flex flex-wrap gap-1'>
                {product.categories?.map((category) => (
                  <Badge key={category.id} variant='outline'>
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
