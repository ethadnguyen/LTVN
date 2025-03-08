'use client';

import { useEffect, useState, useCallback } from 'react';
import { getActiveProducts } from '@/services/modules/product.service';
import { ProductRes } from '@/services/types/response/product_types/product.res';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { Button } from './ui/button';
import Link from 'next/link';
import { useCartStore } from '@/store/cart.store';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface ProductsGridProps {
  category_id?: string;
}

export default function ProductsGrid({ category_id }: ProductsGridProps) {
  const [products, setProducts] = useState<ProductRes[]>([]);
  const [mounted, setMounted] = useState(false);
  const { addToCart } = useCartStore();
  const { toast } = useToast();
  const { user } = useAuth(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!mounted) return;

      try {
        const response = await getActiveProducts({
          category_id: category_id,
          is_active: true,
        });
        setProducts(response.products);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách sản phẩm',
          variant: 'destructive',
        });
      }
    };

    fetchProducts();
  }, [category_id, mounted, toast]);

  const handleAddToCart = useCallback(
    async (product: ProductRes) => {
      if (!mounted) return;

      if (!user) {
        toast({
          title: 'Thông báo',
          description: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng',
        });
        router.push('/auth/sign-in');
        return;
      }

      try {
        await addToCart({ product_id: product.id, quantity: 1 });
        toast({
          title: 'Thành công',
          description: `Đã thêm ${product.name} vào giỏ hàng`,
        });
      } catch (err) {
        console.error('Error adding to cart:', err);
        toast({
          title: 'Lỗi',
          description: 'Không thể thêm vào giỏ hàng',
          variant: 'destructive',
        });
      }
    },
    [addToCart, mounted, toast, user, router]
  );

  if (!mounted) {
    return null;
  }

  if (products.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12'>
        <p className='text-gray-500'>Không tìm thấy sản phẩm nào</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4'>
      {products.map((product) => (
        <div key={product.id} className='group'>
          <Link href={`/products/${product.id}`} className='cursor-pointer'>
            <div className='aspect-square relative mb-2 rounded-lg overflow-hidden'>
              <Image
                src={product.images?.[0] || '/placeholder.png'}
                alt={product.name}
                fill
                className='object-cover group-hover:scale-105 transition-transform duration-300'
                unoptimized
              />
            </div>
            <h3 className='font-medium text-sm mb-1'>{product.name}</h3>
            <p className='text-primary font-semibold'>
              {formatCurrency(product.price)}
            </p>
          </Link>
          <Button
            className='w-full mt-2'
            size='sm'
            onClick={() => handleAddToCart(product)}
          >
            Thêm vào giỏ hàng
          </Button>
        </div>
      ))}
    </div>
  );
}
