'use client';

import { ChevronLeft, ChevronRight, Grid2X2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDragScroll } from '@/hooks/use-drag-scroll';
import { useEffect, useState } from 'react';
import { getActiveCategories } from '@/services/modules/category.service';
import { CategoryRes } from '@/services/types/response/category_types/category.res';
import Link from 'next/link';

export default function CategorySection() {
  const { containerRef, dragListeners, isDragging } = useDragScroll();
  const [categories, setCategories] = useState<CategoryRes[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getActiveCategories({ is_active: true });
        console.log(response);
        setCategories(response.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <section className='container mx-auto px-4 py-6'>
        <div className='relative max-w-6xl mx-auto'>
          <div className='flex justify-center gap-8'>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className='flex flex-col items-center flex-shrink-0 gap-2 w-[100px] animate-pulse'
              >
                <div className='w-16 h-16 rounded-lg bg-gray-200' />
                <div className='w-16 h-4 rounded bg-gray-200' />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className='container mx-auto px-4 py-6'>
      <div className='relative max-w-6xl mx-auto'>
        <Button
          variant='ghost'
          size='icon'
          className='absolute -left-4 top-1/2 -translate-y-1/2 z-10'
          onClick={() => scroll('left')}
        >
          <ChevronLeft className='h-6 w-6' />
        </Button>

        <div
          ref={containerRef}
          {...dragListeners}
          className={`
            flex justify-center gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-2
            ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}
          `}
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className='flex flex-col items-center flex-shrink-0 gap-2 w-[100px] snap-start'
            >
              <Button
                variant='outline'
                className='w-16 h-16 rounded-lg pointer-events-none'
              >
                <Grid2X2 className='h-8 w-8' />
              </Button>
              <span className='text-sm pointer-events-none text-center'>
                {category.name}
              </span>
            </Link>
          ))}
        </div>

        <Button
          variant='ghost'
          size='icon'
          className='absolute -right-4 top-1/2 -translate-y-1/2 z-10'
          onClick={() => scroll('right')}
        >
          <ChevronRight className='h-6 w-6' />
        </Button>
      </div>
    </section>
  );
}
