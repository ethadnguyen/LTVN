'use client';

import { ImageSlider } from '@/components/image-slider';
import { ProductActions } from '@/components/product-actions';
import { Specifications } from '@/components/specifications';
import { ReviewsSection } from '@/components/reviews-section';
import { SimilarProducts } from '@/components/similar-products';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProductById } from '@/services/modules/product.service';
import { ProductRes } from '@/services/types/response/product_types/product.res';

const reviews = [
  {
    id: '1',
    rating: 5,
    comment: 'Great CPU, amazing performance!',
    author: 'John Doe',
    date: '2024-02-15',
  },
  {
    id: '2',
    rating: 4,
    comment: 'Good performance but runs a bit hot.',
    author: 'Jane Smith',
    date: '2024-02-14',
  },
  {
    id: '3',
    rating: 5,
    comment: "Best CPU I've ever used.",
    author: 'Mike Johnson',
    date: '2024-02-13',
  },
];

const similarProducts = [
  {
    id: '2',
    name: 'AMD Ryzen 7 7700X',
    price: 449,
    image: '/placeholder.svg?height=400&width=400',
  },
  {
    id: '3',
    name: 'AMD Ryzen 5 7600X',
    price: 299,
    image: '/placeholder.svg?height=400&width=400',
  },
  {
    id: '4',
    name: 'Intel Core i9-13900K',
    price: 589,
    image: '/placeholder.svg?height=400&width=400',
  },
  {
    id: '5',
    name: 'Intel Core i7-13700K',
    price: 409,
    image: '/placeholder.svg?height=400&width=400',
  },
  {
    id: '6',
    name: 'Intel Core i5-13600K',
    price: 319,
    image: '/placeholder.svg?height=400&width=400',
  },
];

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductRes | null>(null);
  const handleSubmitReview = useCallback((comment: string, rating: number) => {
    console.log('New review:', { comment, rating });
  }, []);

  useEffect(() => {
    const loadProduct = async () => {
      const product = await getProductById(Number(id));
      setProduct(product);
    };
    loadProduct();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className='container mx-auto px-4 py-8 space-y-12'>
      <div className='grid gap-8 lg:grid-cols-2'>
        <div className='space-y-6'>
          <ImageSlider images={product.images} />
          <ProductActions
            price={product.price}
            rating={5}
            onAddToWishlist={() => console.log('Add to wishlist')}
            onBuyNow={() => console.log('Buy now')}
            onAddToCart={() => console.log('Add to cart')}
          />
        </div>

        <div>
          <h2 className='text-2xl font-bold mb-4'>Thông số kỹ thuật</h2>
          <Specifications product={product} />
        </div>
      </div>

      <ReviewsSection reviews={reviews} onSubmitReview={handleSubmitReview} />
      <SimilarProducts products={similarProducts} />
    </div>
  );
}
