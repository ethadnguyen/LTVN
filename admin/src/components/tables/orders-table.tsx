'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

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

interface Order {
  id: string;
  customer: string;
  status: 'cho_xac_nhan' | 'dang_xu_ly' | 'hoan_thanh' | 'da_huy';
  total: number;
  items: number;
  date: string;
}

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'id',
    header: 'Mã đơn hàng',
  },
  {
    accessorKey: 'customer',
    header: 'Khách hàng',
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusMap: Record<string, string> = {
        cho_xac_nhan: 'Chờ xác nhận',
        dang_xu_ly: 'Đang xử lý',
        hoan_thanh: 'Hoàn thành',
        da_huy: 'Đã hủy',
      };
      return (
        <Badge
          variant={
            status === 'hoan_thanh'
              ? 'default'
              : status === 'dang_xu_ly'
              ? 'warning'
              : status === 'da_huy'
              ? 'destructive'
              : 'secondary'
          }
        >
          {statusMap[status]}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'total',
    header: 'Tổng tiền',
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('total'));
      const formatted = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(amount);
      return formatted;
    },
  },
  {
    accessorKey: 'items',
    header: 'Số lượng',
  },
  {
    accessorKey: 'date',
    header: 'Ngày đặt',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const order = row.original;

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(order.id)}
            >
              Sao chép mã đơn
            </DropdownMenuItem>
            <DropdownMenuItem>Xem khách hàng</DropdownMenuItem>
            <DropdownMenuItem>Chi tiết đơn hàng</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const data: Order[] = [
  {
    id: 'DH001',
    customer: 'Nguyễn Văn A',
    status: 'hoan_thanh',
    total: 1259000,
    items: 3,
    date: '21/02/2024',
  },
  {
    id: 'DH002',
    customer: 'Trần Thị B',
    status: 'dang_xu_ly',
    total: 2550000,
    items: 2,
    date: '21/02/2024',
  },
  {
    id: 'DH003',
    customer: 'Lê Văn C',
    status: 'cho_xac_nhan',
    total: 750000,
    items: 1,
    date: '21/02/2024',
  },
];

export function OrdersTable() {
  return <DataTable columns={columns} data={data} />;
}
