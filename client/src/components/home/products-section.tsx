'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { useDragScroll } from '@/hooks/use-drag-scroll';

import { ProductRes } from '@/services/types/response/product_types/product.res';
interface ProductSectionProps {
  products: ProductRes[];
}

export default function ProductSection({ products }: ProductSectionProps) {
  const { containerRef, dragListeners, isDragging } = useDragScroll();

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className='container mx-auto px-4 py-6 relative'>
      <div className='flex items-center'>
        <Button
          variant='ghost'
          size='icon'
          className='absolute -left-4 z-10 h-12 w-12'
          onClick={() => scroll('left')}
        >
          <ChevronLeft className='h-8 w-8' />
        </Button>

        <div
          ref={containerRef}
          {...dragListeners}
          className={`
            flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory
            ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}
          `}
        >
          {products.map((product) => (
            <Card key={product.id} className='min-w-[300px] snap-start'>
              <CardContent className='p-4 pointer-events-none'>
                <div className='aspect-square relative mb-3'>
                  <Image
                    src={product.images[0] || '/placeholder.svg'}
                    alt={product.name}
                    fill
                    className='object-cover rounded-lg'
                    unoptimized
                  />
                </div>
                <h3 className='font-semibold text-center'>{product.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          variant='ghost'
          size='icon'
          className='absolute -right-4 z-10 h-12 w-12'
          onClick={() => scroll('right')}
        >
          <ChevronRight className='h-8 w-8' />
        </Button>
      </div>
    </section>
  );
}
