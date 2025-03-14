import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function AddressSkeleton() {
  return (
    <Card className='overflow-hidden border border-border'>
      <CardHeader className='bg-muted pb-3'>
        <div className='flex justify-between items-start'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-5 w-5 rounded-full' />
            <Skeleton className='h-6 w-32' />
          </div>
          <div className='flex gap-2'>
            <Skeleton className='h-9 w-16' />
            <Skeleton className='h-9 w-16' />
          </div>
        </div>
      </CardHeader>
      <CardContent className='pt-4'>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full mb-2' />
          <Skeleton className='h-4 w-3/4 mb-2' />
          <Skeleton className='h-4 w-1/2' />
        </div>
      </CardContent>
    </Card>
  );
}
