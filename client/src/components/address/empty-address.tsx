import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Plus } from 'lucide-react';

interface EmptyAddressProps {
  onAddNew: () => void;
}

export function EmptyAddress({ onAddNew }: EmptyAddressProps) {
  return (
    <Card className='border border-border'>
      <CardContent className='flex flex-col items-center justify-center py-10'>
        <MapPin className='h-12 w-12 text-muted-foreground mb-4' />
        <p className='text-xl font-medium mb-2'>Bạn chưa có địa chỉ nào</p>
        <p className='text-muted-foreground mb-4 text-center'>
          Thêm địa chỉ để dễ dàng đặt hàng và giao hàng nhanh chóng
        </p>
        <Button onClick={onAddNew}>
          <Plus className='mr-2 h-4 w-4' /> Thêm địa chỉ mới
        </Button>
      </CardContent>
    </Card>
  );
}
