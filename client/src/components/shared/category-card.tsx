import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  slug: string;
  icon: LucideIcon;
  productCount: number;
}

export function CategoryCard({
  name,
  slug,
  icon: Icon,
  productCount,
}: CategoryCardProps) {
  return (
    <Link
      href={`/category/${slug}`}
      className='group flex flex-col items-center justify-center p-6 rounded-lg border bg-card hover:bg-muted/50 transition-colors text-center'
    >
      <div className='mb-3 p-3 rounded-full bg-primary/10 text-primary'>
        <Icon className='h-8 w-8' />
      </div>
      <h3 className='font-medium'>{name}</h3>
      <p className='text-sm text-muted-foreground'>{productCount} sản phẩm</p>
    </Link>
  );
}
