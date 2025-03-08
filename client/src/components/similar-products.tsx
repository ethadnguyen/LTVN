import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface SimilarProductsProps {
  products: Product[];
}

export function SimilarProducts({ products }: SimilarProductsProps) {
  return (
    <div className='space-y-8'>
      <h2 className='text-2xl font-bold'>Similar Products</h2>
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className='group rounded-lg border p-2 hover:border-primary'
          >
            <div className='aspect-square relative mb-2 overflow-hidden rounded-md'>
              <Image
                src={product.image || '/placeholder.svg'}
                alt={product.name}
                fill
                className='object-cover transition-transform group-hover:scale-105'
              />
            </div>
            <h3 className='font-medium line-clamp-2'>{product.name}</h3>
            <p className='text-sm text-muted-foreground'>
              {formatCurrency(product.price)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
