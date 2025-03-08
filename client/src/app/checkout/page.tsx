'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ShippingForm } from './checkout-form';
import type {
  CartItem,
  PaymentMethod,
} from '../../services/types/response/cart_types/cart';
import { formatCurrency } from '@/lib/utils';

// Example cart items - In a real app, this would come from your cart state
const cartItems: CartItem[] = [
  {
    product: {
      id: '1',
      name: 'AMD Ryzen 9 7950X',
      price: 699,
      category: 'CPU',
      image: '/placeholder.svg',
      specs: {
        socket: 'AM5',
        cores: 16,
        threads: 32,
        tdp: 170,
      },
    },
    quantity: 1,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod['type']>('cod');

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const shippingFee = subtotal > 1000 ? 0 : 50;
  const total = subtotal + shippingFee;

  async function handleSubmit(values: any) {
    try {
      setIsSubmitting(true);

      // Tạo địa chỉ đầy đủ từ các thành phần
      const fullAddress = `${values.streetAddress}, ${values.ward}, ${values.district}, ${values.province}`;

      const order = {
        items: cartItems,
        shippingAddress: {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          province: values.province,
          district: values.district,
          ward: values.ward,
          streetAddress: values.streetAddress,
          fullAddress, // Địa chỉ đầy đủ để hiển thị hoặc sử dụng sau này
        },
        paymentMethod: {
          type: paymentMethod,
        },
        subtotal,
        shippingFee,
        total,
      };

      // In a real app, you would send this to your backend
      console.log('Order:', order);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redirect to success page
      router.push('/checkout/success');
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-8'>Thanh toán</h1>

      <div className='grid gap-8 lg:grid-cols-[1fr_400px]'>
        {/* Checkout Form */}
        <div className='space-y-8'>
          <div>
            <h2 className='text-lg font-semibold mb-4'>Thông tin giao hàng</h2>
            <ShippingForm onSubmit={handleSubmit} />
          </div>

          <Separator />

          <div className='space-y-4'>
            <h2 className='text-lg font-semibold'>Phương thức thanh toán</h2>

            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) =>
                setPaymentMethod(value as PaymentMethod['type'])
              }
              className='space-y-2'
            >
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='cod' id='cod' />
                <Label htmlFor='cod'>Thanh toán khi nhận hàng (COD)</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='bank_transfer' id='bank_transfer' />
                <Label htmlFor='bank_transfer'>Chuyển khoản ngân hàng</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='credit_card' id='credit_card' />
                <Label htmlFor='credit_card'>Thẻ tín dụng/ghi nợ</Label>
              </div>
            </RadioGroup>
          </div>

          <Button className='w-full' disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Đang xử lý...
              </>
            ) : (
              'Đặt hàng'
            )}
          </Button>
        </div>

        {/* Order Summary */}
        <div className='rounded-lg border p-6 space-y-6 h-fit'>
          <h2 className='text-lg font-semibold'>Đơn hàng</h2>

          <div className='space-y-4'>
            {cartItems.map((item) => (
              <div key={item.product.id} className='flex gap-4'>
                <div className='relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-md'>
                  <Image
                    src={item.product.image || '/placeholder.svg'}
                    alt={item.product.name}
                    fill
                    className='object-cover'
                  />
                </div>
                <div className='flex flex-1 flex-col justify-center'>
                  <h3 className='font-medium'>{item.product.name}</h3>
                  <p className='text-sm text-muted-foreground'>
                    Số lượng: {item.quantity}
                  </p>
                  <p className='text-sm font-medium'>
                    {formatCurrency(item.product.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span>Tạm tính</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className='flex justify-between'>
              <span>Phí vận chuyển</span>
              <span>
                {shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}
              </span>
            </div>
            <Separator />
            <div className='flex justify-between text-lg font-semibold'>
              <span>Tổng cộng</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
