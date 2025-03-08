'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function CartPage() {
  const router = useRouter();
  const { cart, fetchCart, updateCartItem, removeFromCart } = useCartStore();
  const { user, loading: authLoading } = useAuth(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initCart = async () => {
      if (!authLoading && user) {
        try {
          await fetchCart();
        } catch (error) {
          console.error('Error fetching cart:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initCart();
  }, [fetchCart, user, authLoading]);

  const handleUpdateQuantity = useCallback(
    async (productId: number, newQuantity: number) => {
      if (newQuantity > 0) {
        try {
          await updateCartItem({
            product_id: productId,
            quantity: newQuantity,
          });
        } catch (error) {
          console.error('Error updating quantity:', error);
        }
      }
    },
    [updateCartItem]
  );

  const handleRemoveItem = useCallback(
    async (productId: number) => {
      try {
        await removeFromCart(productId);
      } catch (error) {
        console.error('Error removing item:', error);
      }
    },
    [removeFromCart]
  );

  console.log(cart);

  const handleCheckout = useCallback(() => {
    router.push('/checkout');
  }, [router]);

  if (authLoading || isLoading) {
    return (
      <div className='container mx-auto px-4 py-16 text-center'>
        <h1 className='text-2xl font-bold mb-4'>Đang tải...</h1>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className='container mx-auto px-4 py-16 text-center'>
        <h1 className='text-2xl font-bold mb-4'>Giỏ hàng của bạn đang trống</h1>
        <Button onClick={() => router.push('/')}>Tiếp tục mua sắm</Button>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-8'>Giỏ hàng</h1>

      <div className='grid gap-8 lg:grid-cols-[1fr_400px]'>
        {/* Cart Items */}
        <div className='space-y-4'>
          {cart.items.map((item) => (
            <div
              key={item.product.id}
              className='flex gap-4 rounded-lg border p-4'
            >
              <div className='relative aspect-square w-24 flex-shrink-0 overflow-hidden rounded-md'>
                <Image
                  src={item.product.images[0] || '/placeholder.png'}
                  alt={item.product.name}
                  fill
                  className='object-cover'
                  unoptimized
                />
              </div>

              <div className='flex flex-1 flex-col justify-between'>
                <div className='space-y-1'>
                  <h3 className='font-medium'>{item.product.name}</h3>
                  <p className='text-sm text-muted-foreground'>
                    {formatCurrency(item.product.price)}
                  </p>
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() =>
                        handleUpdateQuantity(item.product.id, item.quantity - 1)
                      }
                    >
                      <Minus className='h-4 w-4' />
                    </Button>
                    <span className='w-8 text-center'>{item.quantity}</span>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() =>
                        handleUpdateQuantity(item.product.id, item.quantity + 1)
                      }
                    >
                      <Plus className='h-4 w-4' />
                    </Button>
                  </div>

                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleRemoveItem(item.product.id)}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className='rounded-lg border p-6 space-y-4 h-fit'>
          <h2 className='text-lg font-semibold'>Tổng đơn hàng</h2>

          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span>Tạm tính</span>
              <span>{formatCurrency(cart.total)}</span>
            </div>
            <div className='flex justify-between'>
              <span>Phí vận chuyển</span>
              <span>
                {cart.total > 1000000 ? 'Miễn phí' : formatCurrency(30000)}
              </span>
            </div>
            <Separator />
            <div className='flex justify-between text-lg font-semibold'>
              <span>Tổng cộng</span>
              <span>
                {formatCurrency(
                  cart.total > 1000000 ? cart.total : cart.total + 30000
                )}
              </span>
            </div>
          </div>

          <Button className='w-full' onClick={handleCheckout}>
            Tiến hành thanh toán
          </Button>
        </div>
      </div>
    </div>
  );
}
