'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '@/store/useCartStore';
import { useToast } from '@/hooks/use-toast';
import { UpdateCartItemReq } from '@/services/types/request/cart_types/update-cart-item.req';

// Hàm định dạng số tiền
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN').format(amount);
};

export default function CartPage() {
  const { cart, isLoading, error, fetchCart, updateCartItem, removeFromCart } =
    useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleUpdateQuantity = async (
    productId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    try {
      const updateData: UpdateCartItemReq = {
        product_id: productId,
        quantity: newQuantity,
      };
      await updateCartItem(updateData);
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật số lượng sản phẩm',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveItem = async (productId: number) => {
    try {
      await removeFromCart(productId);
      toast({
        title: 'Thành công',
        description: 'Đã xóa sản phẩm khỏi giỏ hàng',
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa sản phẩm khỏi giỏ hàng',
        variant: 'destructive',
      });
    }
  };

  const applyCoupon = () => {
    if (!couponCode) return;

    setIsApplyingCoupon(true);

    setTimeout(() => {
      setIsApplyingCoupon(false);
      toast({
        title: 'Thông báo',
        description: `Đã áp dụng mã giảm giá: ${couponCode}`,
      });
      setCouponCode('');
    }, 1000);
  };

  const subtotal = cart?.total || 0;
  const shipping = subtotal > 0 ? 50000 : 0;
  const discount = 0;
  const total = Number(subtotal) + Number(shipping) - Number(discount);

  if (isLoading && !cart) {
    return (
      <div className='container py-8 flex flex-col items-center justify-center min-h-[50vh]'>
        <Loader2 className='h-8 w-8 animate-spin mb-4' />
        <p>Đang tải giỏ hàng...</p>
      </div>
    );
  }

  // Hiển thị lỗi nếu có
  if (error && !isLoading) {
    return (
      <div className='container py-8 text-center'>
        <h1 className='text-3xl font-bold mb-4'>Giỏ hàng</h1>
        <div className='p-4 bg-destructive/10 text-destructive rounded-md'>
          <p>Có lỗi xảy ra: {error}</p>
          <Button onClick={() => fetchCart()} className='mt-4'>
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='container py-8'>
      <h1 className='text-3xl font-bold mb-8'>Giỏ hàng</h1>

      {!cart?.items?.length ? (
        <div className='text-center py-12'>
          <ShoppingBag className='h-16 w-16 mx-auto mb-4 text-muted-foreground' />
          <h2 className='text-2xl font-bold mb-2'>Giỏ hàng trống</h2>
          <p className='text-muted-foreground mb-6'>
            Bạn chưa có sản phẩm nào trong giỏ hàng
          </p>
          <Button asChild>
            <Link href='/category/all'>Tiếp tục mua sắm</Link>
          </Button>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2'>
            <div className='space-y-4'>
              {cart.items.map((item) => (
                <div
                  key={item.product_id}
                  className='flex items-center space-x-4 border rounded-lg p-4'
                >
                  <div className='relative h-20 w-20 shrink-0'>
                    <Image
                      src={item.product?.images?.[0] || '/placeholder.svg'}
                      alt={item.product?.name || 'Sản phẩm'}
                      fill
                      className='object-cover rounded-md'
                    />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <Link
                      href={`/product/${item.product?.slug}`}
                      className='font-medium hover:text-primary'
                    >
                      {item.product?.name || 'Sản phẩm không xác định'}
                    </Link>
                    <div className='text-muted-foreground text-sm mt-1'>
                      {formatCurrency(item.price)}đ
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Button
                      variant='outline'
                      size='icon'
                      className='h-8 w-8'
                      onClick={() =>
                        handleUpdateQuantity(item.product_id, item.quantity - 1)
                      }
                    >
                      <Minus className='h-4 w-4' />
                    </Button>
                    <span className='w-8 text-center'>{item.quantity}</span>
                    <Button
                      variant='outline'
                      size='icon'
                      className='h-8 w-8'
                      onClick={() =>
                        handleUpdateQuantity(item.product_id, item.quantity + 1)
                      }
                    >
                      <Plus className='h-4 w-4' />
                    </Button>
                  </div>
                  <div className='w-24 text-right font-medium'>
                    {formatCurrency(item.price * item.quantity)}đ
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 text-muted-foreground hover:text-destructive'
                    onClick={() => handleRemoveItem(item.product_id)}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Card>
              <CardContent className='p-6'>
                <h2 className='text-xl font-bold mb-4'>Tóm tắt đơn hàng</h2>
                <div className='space-y-4'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Tạm tính</span>
                    <span>{formatCurrency(subtotal)}đ</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>
                      Phí vận chuyển
                    </span>
                    <span>{formatCurrency(shipping)}đ</span>
                  </div>
                  {discount > 0 && (
                    <div className='flex justify-between text-green-600'>
                      <span>Giảm giá</span>
                      <span>-{formatCurrency(discount)}đ</span>
                    </div>
                  )}
                  <Separator />
                  <div className='flex justify-between font-bold'>
                    <span>Tổng cộng</span>
                    <span>{formatCurrency(total)}đ</span>
                  </div>

                  <div className='pt-4'>
                    <div className='flex space-x-2 mb-4'>
                      <Input
                        placeholder='Mã giảm giá'
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <Button
                        variant='outline'
                        onClick={applyCoupon}
                        disabled={isApplyingCoupon || !couponCode}
                      >
                        Áp dụng
                      </Button>
                    </div>
                    <Button
                      asChild
                      className='w-full'
                      disabled={!cart?.items?.length}
                    >
                      <Link href='/checkout'>Thanh toán</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
