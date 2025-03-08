'use client';

import CategorySection from '@/components/home/categories-section';
import ProductSection from '@/components/home/products-section';
import Banner from '@/components/Banner';
import { ProductRes } from '@/services/types/response/product_types/product.res';

interface HomeContentProps {
  products: ProductRes[];
}

export default function HomeContent({ products }: HomeContentProps) {
  return (
    <div className='min-h-screen flex flex-col'>
      <Banner />
      <CategorySection />
      <ProductSection products={products} />
    </div>
  );
}
