import { Plus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { PromotionsTable } from '@/components/tables/promotions-table';

export default function PromotionsPage() {
  return (
    <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
      <div className='flex items-center justify-between space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Khuyến mãi</h2>
        <div className='flex items-center space-x-2'>
          <Button asChild>
            <Link href='/promotions/new'>
              <Plus className='mr-2 h-4 w-4' /> Thêm khuyến mãi
            </Link>
          </Button>
        </div>
      </div>
      <PromotionsTable />
    </div>
  );
}
