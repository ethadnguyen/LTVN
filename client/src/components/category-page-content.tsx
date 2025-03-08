'use client';

import { Suspense, useEffect, useState } from 'react';
import CategorySection from '@/components/home/categories-section';
import ProductsGrid from '@/components/products-grid';
import { useParams } from 'next/navigation';

export default function CategoryPageContent() {
  const [mounted, setMounted] = useState(false);
  const params = useParams();
  const category_id = params.categoryId as string;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main>
        <CategorySection />
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4'>
          {[...Array(8)].map((_, i) => (
            <div key={i} className='animate-pulse'>
              <div className='bg-gray-200 aspect-square rounded-lg mb-2' />
              <div className='h-4 bg-gray-200 rounded w-3/4 mb-2' />
              <div className='h-4 bg-gray-200 rounded w-1/2' />
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main>
      <CategorySection />
      <Suspense
        fallback={
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4'>
            {[...Array(8)].map((_, i) => (
              <div key={i} className='animate-pulse'>
                <div className='bg-gray-200 aspect-square rounded-lg mb-2' />
                <div className='h-4 bg-gray-200 rounded w-3/4 mb-2' />
                <div className='h-4 bg-gray-200 rounded w-1/2' />
              </div>
            ))}
          </div>
        }
      >
        <ProductsGrid category_id={category_id} />
      </Suspense>
    </main>
  );
}
