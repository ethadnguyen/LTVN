import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Cập nhật interface ProductCardProps để loại bỏ isNew và đổi tên isSale thành is_sale
interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  rating: number;
  category: string;
  is_sale?: boolean;
}

// Cập nhật component ProductCard
export function ProductCard({
  id,
  name,
  slug,
  price,
  image,
  rating,
  category,
  is_sale = false,
}: ProductCardProps) {
  return (
    <div className='group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md'>
      <Link href={`/product/${slug}`} className='block'>
        <div className='relative aspect-square overflow-hidden'>
          <Image
            src={image || '/placeholder.svg'}
            alt={name}
            fill
            className='object-cover transition-transform group-hover:scale-105'
          />
          {is_sale && (
            <Badge
              variant='destructive'
              className='absolute right-2 top-2 z-10'
            >
              Giảm giá
            </Badge>
          )}
        </div>
        <div className='p-4'>
          <h3 className='line-clamp-2 font-medium text-card-foreground group-hover:text-primary'>
            {name}
          </h3>
          <p className='mt-1 text-sm text-muted-foreground'>{category}</p>
          <div className='mt-2 flex items-center'>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < rating
                    ? 'fill-primary text-primary'
                    : 'fill-muted text-muted'
                }`}
              />
            ))}
            <span className='ml-1 text-xs text-muted-foreground'>
              ({rating.toFixed(1)})
            </span>
          </div>
          <div className='mt-2'>
            <span className='font-medium text-card-foreground'>
              {price.toLocaleString()}đ
            </span>
          </div>
        </div>
      </Link>
      <div className='absolute bottom-0 left-0 right-0 flex translate-y-full items-center justify-between bg-background/80 p-2 backdrop-blur-sm transition-transform group-hover:translate-y-0'>
        <Button variant='outline' size='sm' className='w-full'>
          Thêm vào giỏ
        </Button>
      </div>
    </div>
  );
}
