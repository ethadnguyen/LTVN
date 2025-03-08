import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutSuccessPage() {
  return (
    <div className='container mx-auto px-4 py-16 text-center'>
      <CheckCircle className='mx-auto h-16 w-16 text-green-500' />
      <h1 className='mt-4 text-2xl font-bold'>Order Placed Successfully!</h1>
      <p className='mt-2 text-muted-foreground'>
        Thank you for your purchase. We'll send you an email with your order
        details.
      </p>
      <div className='mt-8 space-x-4'>
        <Button asChild>
          <Link href='/'>Continue Shopping</Link>
        </Button>
        <Button variant='outline' asChild>
          <Link href='/account/orders'>View Orders</Link>
        </Button>
      </div>
    </div>
  );
}
