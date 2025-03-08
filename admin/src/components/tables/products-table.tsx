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

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'con_hang' | 'sap_het' | 'het_hang';
}

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Tên sản phẩm',
  },
  {
    accessorKey: 'category',
    header: 'Danh mục',
  },
  {
    accessorKey: 'price',
    header: 'Giá',
    cell: ({ row }) => {
      const price = Number.parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(price);
      return formatted;
    },
  },
  {
    accessorKey: 'stock',
    header: 'Tồn kho',
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusMap: Record<string, string> = {
        con_hang: 'Còn hàng',
        sap_het: 'Sắp hết',
        het_hang: 'Hết hàng',
      };
      return (
        <Badge
          variant={
            status === 'con_hang'
              ? 'default'
              : status === 'sap_het'
              ? 'warning'
              : 'destructive'
          }
        >
          {statusMap[status]}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const product = row.original;

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
              onClick={() => navigator.clipboard.writeText(product.id)}
            >
              Sao chép ID
            </DropdownMenuItem>
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

const data: Product[] = [
  {
    id: '1',
    name: 'CPU Intel Core i9 13900K',
    category: 'CPU - Bộ vi xử lý',
    price: 15990000,
    stock: 23,
    status: 'con_hang',
  },
  {
    id: '2',
    name: 'RAM DDR5 G.Skill 32GB',
    category: 'RAM - Bộ nhớ trong',
    price: 4290000,
    stock: 5,
    status: 'sap_het',
  },
  {
    id: '3',
    name: 'VGA ASUS ROG STRIX RTX 4090',
    category: 'VGA - Card màn hình',
    price: 49990000,
    stock: 0,
    status: 'het_hang',
  },
  {
    id: '4',
    name: 'SSD Samsung 970 EVO Plus 1TB',
    category: 'SSD - Ổ cứng thể rắn',
    price: 2790000,
    stock: 45,
    status: 'con_hang',
  },
  {
    id: '5',
    name: 'Mainboard ASUS ROG MAXIMUS Z790',
    category: 'Mainboard - Bo mạch chủ',
    price: 14990000,
    stock: 8,
    status: 'con_hang',
  },
];

export function ProductsTable() {
  return <DataTable columns={columns} data={data} />;
}
