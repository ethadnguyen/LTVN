import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Banner() {
  return (
    <div className='bg-primary text-primary-foreground py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between'>
        <div className='text-center sm:text-left mb-4 sm:mb-0'>
          <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2'>
            Xây dựng PC trong mơ của bạn
          </h1>
          <p className='text-sm sm:text-base md:text-lg max-w-xl'>
            Tùy chỉnh máy tính hoàn hảo của bạn với công cụ xây dựng dễ sử dụng
            của chúng tôi.
          </p>
        </div>
        <div className='mt-4 sm:mt-0'>
          <Button
            asChild
            size='lg'
            className='bg-accent text-accent-foreground hover:bg-accent/90'
          >
            <Link href='/builder'>Bắt đầu xây dựng ngay</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
