'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash, Lock } from 'lucide-react';

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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Account {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  status: 'active' | 'inactive' | 'locked';
  lastLogin: string;
  avatar?: string;
}

const columns: ColumnDef<Account>[] = [
  {
    accessorKey: 'name',
    header: 'Tên nhân viên',
    cell: ({ row }) => {
      const account = row.original;
      return (
        <div className='flex items-center gap-3'>
          <Avatar>
            <AvatarImage src={account.avatar} alt={account.name} />
            <AvatarFallback>
              {account.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className='font-medium'>{account.name}</div>
            <div className='text-sm text-muted-foreground'>{account.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'role',
    header: 'Vai trò',
    cell: ({ row }) => {
      const role = row.getValue('role') as string;
      const roleMap: Record<string, string> = {
        admin: 'Quản trị viên',
        staff: 'Nhân viên',
      };
      return (
        <Badge variant={role === 'admin' ? 'default' : 'secondary'}>
          {roleMap[role]}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusMap: Record<string, string> = {
        active: 'Đang hoạt động',
        inactive: 'Đã vô hiệu',
        locked: 'Đã khóa',
      };
      return (
        <Badge
          variant={
            status === 'active'
              ? 'default'
              : status === 'inactive'
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
    accessorKey: 'lastLogin',
    header: 'Đăng nhập lần cuối',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const account = row.original;

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
            <DropdownMenuItem>
              <Lock className='mr-2 h-4 w-4' /> Đổi mật khẩu
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

const data: Account[] = [
  {
    id: '1',
    name: 'Nguyễn Văn Admin',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    lastLogin: '21/02/2024 15:30',
    avatar: '/avatars/01.png',
  },
  {
    id: '2',
    name: 'Trần Thị Nhân Viên',
    email: 'staff1@example.com',
    role: 'staff',
    status: 'active',
    lastLogin: '21/02/2024 14:20',
    avatar: '/avatars/02.png',
  },
  {
    id: '3',
    name: 'Lê Văn Nhân Viên',
    email: 'staff2@example.com',
    role: 'staff',
    status: 'inactive',
    lastLogin: '20/02/2024 09:15',
    avatar: '/avatars/03.png',
  },
  {
    id: '4',
    name: 'Phạm Thị Nhân Viên',
    email: 'staff3@example.com',
    role: 'staff',
    status: 'locked',
    lastLogin: '19/02/2024 16:40',
    avatar: '/avatars/04.png',
  },
];

export function AccountsTable() {
  return <DataTable columns={columns} data={data} />;
}
