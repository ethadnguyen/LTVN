'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

interface Promotion {
  id: string;
  name: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  status: 'dang_chay' | 'sap_dien_ra' | 'ket_thuc';
  productsCount: number;
}

const columns: ColumnDef<Promotion>[] = [
  {
    accessorKey: 'name',
    header: 'Tên chương trình',
  },
  {
    accessorKey: 'discountType',
    header: 'Loại giảm giá',
    cell: ({ row }) => {
      const type = row.getValue('discountType') as string;
      const value = row.getValue('discountValue');
      if (typeof value !== 'number') return '-';
      return type === 'percentage'
        ? `${value}%`
        : `${value.toLocaleString('vi-VN')}đ`;
    },
  },
  {
    accessorKey: 'startDate',
    header: 'Ngày bắt đầu',
  },
  {
    accessorKey: 'endDate',
    header: 'Ngày kết thúc',
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusMap: Record<string, string> = {
        dang_chay: 'Đang chạy',
        sap_dien_ra: 'Sắp diễn ra',
        ket_thuc: 'Kết thúc',
      };
      return (
        <Badge
          variant={
            status === 'dang_chay'
              ? 'default'
              : status === 'sap_dien_ra'
              ? 'secondary'
              : 'destructive'
          }
        >
          {statusMap[status]}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'productsCount',
    header: 'Số sản phẩm',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const promotion = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Mở menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuItem>
              <Pencil className='mr-2 h-4 w-4' /> Sửa
            </DropdownMenuItem>
            <DropdownMenuItem className='text-red-600'>
              <Trash className='mr-2 h-4 w-4' /> Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const data: Promotion[] = [
  {
    id: '1',
    name: 'Khuyến mãi hè',
    discountType: 'percentage' as const,
    discountValue: 20,
    startDate: '01/06/2024',
    endDate: '30/06/2024',
    status: 'sap_dien_ra',
    productsCount: 150,
  },
  {
    id: '2',
    name: 'Flash Sale',
    discountType: 'fixed' as const,
    discountValue: 100000,
    startDate: '21/02/2024',
    endDate: '22/02/2024',
    status: 'dang_chay',
    productsCount: 45,
  },
  {
    id: '3',
    name: 'Khuyến mãi Tết',
    discountType: 'percentage' as const,
    discountValue: 15,
    startDate: '01/01/2024',
    endDate: '15/01/2024',
    status: 'ket_thuc',
    productsCount: 200,
  },
];

export function PromotionsTable() {
  return <DataTable columns={columns} data={data} />;
}
