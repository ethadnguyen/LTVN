'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, ShoppingCart, Menu, X, Heart, User } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { CategoryDropdown } from '@/components/shared/category-dropdown';
import { CategoryTree } from '@/components/shared/category-tree';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import type { CategoryRes } from '@/services/types/response/category_types/category.res';

// Giả lập dữ liệu danh mục phân cấp
const categories: CategoryRes[] = [
  {
    id: 1,
    name: 'Linh kiện PC',
    parent: null,
    children: [
      {
        id: 11,
        name: 'CPU',
        parent: {
          id: 1,
          name: 'Linh kiện PC',
          parent: null,
          children: [],
          description: '',
          slug: 'linh-kien-pc',
          is_active: true,
          created_at: '',
          updated_at: '',
        },
        children: [
          {
            id: 111,
            name: 'Intel',
            parent: {
              id: 11,
              name: 'CPU',
              parent: null,
              children: [],
              description: '',
              slug: 'cpu',
              is_active: true,
              created_at: '',
              updated_at: '',
            },
            children: [],
            description: 'CPU Intel',
            slug: 'cpu-intel',
            is_active: true,
            created_at: '',
            updated_at: '',
          },
          {
            id: 112,
            name: 'AMD',
            parent: {
              id: 11,
              name: 'CPU',
              parent: null,
              children: [],
              description: '',
              slug: 'cpu',
              is_active: true,
              created_at: '',
              updated_at: '',
            },
            children: [],
            description: 'CPU AMD',
            slug: 'cpu-amd',
            is_active: true,
            created_at: '',
            updated_at: '',
          },
        ],
        description: 'Bộ vi xử lý',
        slug: 'cpu',
        is_active: true,
        created_at: '',
        updated_at: '',
      },
      {
        id: 12,
        name: 'Mainboard',
        parent: {
          id: 1,
          name: 'Linh kiện PC',
          parent: null,
          children: [],
          description: '',
          slug: 'linh-kien-pc',
          is_active: true,
          created_at: '',
          updated_at: '',
        },
        children: [],
        description: 'Bo mạch chủ',
        slug: 'mainboard',
        is_active: true,
        created_at: '',
        updated_at: '',
      },
      {
        id: 13,
        name: 'RAM',
        parent: {
          id: 1,
          name: 'Linh kiện PC',
          parent: null,
          children: [],
          description: '',
          slug: 'linh-kien-pc',
          is_active: true,
          created_at: '',
          updated_at: '',
        },
        children: [],
        description: 'Bộ nhớ RAM',
        slug: 'ram',
        is_active: true,
        created_at: '',
        updated_at: '',
      },
      {
        id: 14,
        name: 'VGA',
        parent: {
          id: 1,
          name: 'Linh kiện PC',
          parent: null,
          children: [],
          description: '',
          slug: 'linh-kien-pc',
          is_active: true,
          created_at: '',
          updated_at: '',
        },
        children: [],
        description: 'Card đồ họa',
        slug: 'vga',
        is_active: true,
        created_at: '',
        updated_at: '',
      },
    ],
    description: 'Các linh kiện máy tính',
    slug: 'linh-kien-pc',
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 2,
    name: 'Laptop',
    parent: null,
    children: [
      {
        id: 21,
        name: 'Gaming',
        parent: {
          id: 2,
          name: 'Laptop',
          parent: null,
          children: [],
          description: '',
          slug: 'laptop',
          is_active: true,
          created_at: '',
          updated_at: '',
        },
        children: [],
        description: 'Laptop Gaming',
        slug: 'laptop-gaming',
        is_active: true,
        created_at: '',
        updated_at: '',
      },
      {
        id: 22,
        name: 'Văn phòng',
        parent: {
          id: 2,
          name: 'Laptop',
          parent: null,
          children: [],
          description: '',
          slug: 'laptop',
          is_active: true,
          created_at: '',
          updated_at: '',
        },
        children: [],
        description: 'Laptop Văn phòng',
        slug: 'laptop-van-phong',
        is_active: true,
        created_at: '',
        updated_at: '',
      },
    ],
    description: 'Máy tính xách tay',
    slug: 'laptop',
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 3,
    name: 'Màn hình',
    parent: null,
    children: [],
    description: 'Màn hình máy tính',
    slug: 'man-hinh',
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 4,
    name: 'Phụ kiện',
    parent: null,
    children: [
      {
        id: 41,
        name: 'Bàn phím',
        parent: {
          id: 4,
          name: 'Phụ kiện',
          parent: null,
          children: [],
          description: '',
          slug: 'phu-kien',
          is_active: true,
          created_at: '',
          updated_at: '',
        },
        children: [],
        description: 'Bàn phím',
        slug: 'ban-phim',
        is_active: true,
        created_at: '',
        updated_at: '',
      },
      {
        id: 42,
        name: 'Chuột',
        parent: {
          id: 4,
          name: 'Phụ kiện',
          parent: null,
          children: [],
          description: '',
          slug: 'phu-kien',
          is_active: true,
          created_at: '',
          updated_at: '',
        },
        children: [],
        description: 'Chuột',
        slug: 'chuot',
        is_active: true,
        created_at: '',
        updated_at: '',
      },
      {
        id: 43,
        name: 'Tai nghe',
        parent: {
          id: 4,
          name: 'Phụ kiện',
          parent: null,
          children: [],
          description: '',
          slug: 'phu-kien',
          is_active: true,
          created_at: '',
          updated_at: '',
        },
        children: [],
        description: 'Tai nghe',
        slug: 'tai-nghe',
        is_active: true,
        created_at: '',
        updated_at: '',
      },
    ],
    description: 'Phụ kiện máy tính',
    slug: 'phu-kien',
    is_active: true,
    created_at: '',
    updated_at: '',
  },
];

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // Giả lập trạng thái đăng nhập - trong thực tế sẽ sử dụng context hoặc state management
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Giả lập số lượng sản phẩm trong giỏ hàng
  const cartItemCount = 3;

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center'>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='outline' size='icon' className='md:hidden mr-2'>
              <Menu className='h-5 w-5' />
              <span className='sr-only'>Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='w-[300px] sm:w-[400px]'>
            <div className='mt-8'>
              <CategoryTree categories={categories} />
            </div>
            <div className='mt-6 border-t pt-6'>
              <SheetClose asChild>
                <Link
                  href='/pc-builder'
                  className='flex items-center px-2 py-1.5 text-lg font-medium text-primary'
                >
                  PC Builder
                </Link>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>

        <Link href='/' className='mr-6 flex items-center space-x-2'>
          <span className='hidden font-bold sm:inline-block text-xl'>
            TechParts
          </span>
        </Link>

        <div className='hidden md:flex items-center gap-6 text-sm'>
          <CategoryDropdown categories={categories} />
          <Link
            href='/pc-builder'
            className='transition-colors hover:text-primary font-medium'
          >
            PC Builder
          </Link>
        </div>

        <div className='flex items-center ml-auto gap-2'>
          {isSearchOpen ? (
            <div className='flex items-center'>
              <Input
                type='search'
                placeholder='Tìm kiếm...'
                className='w-[200px] md:w-[300px]'
              />
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setIsSearchOpen(false)}
              >
                <X className='h-5 w-5' />
              </Button>
            </div>
          ) : (
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className='h-5 w-5' />
              <span className='sr-only'>Tìm kiếm</span>
            </Button>
          )}

          <Link href='/wishlist'>
            <Button variant='ghost' size='icon'>
              <Heart className='h-5 w-5' />
              <span className='sr-only'>Yêu thích</span>
            </Button>
          </Link>

          <Link href='/cart'>
            <Button variant='ghost' size='icon' className='relative'>
              <ShoppingCart className='h-5 w-5' />
              {cartItemCount > 0 && (
                <Badge className='absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs'>
                  {cartItemCount}
                </Badge>
              )}
              <span className='sr-only'>Giỏ hàng</span>
            </Button>
          </Link>

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon'>
                  <User className='h-5 w-5' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem asChild>
                  <Link href='/profile'>Tài khoản của tôi</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href='/orders'>Đơn hàng</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href='/wishlist'>Danh sách yêu thích</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon'>
                  <User className='h-5 w-5' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem asChild>
                  <Link href='/login'>Đăng nhập</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href='/register'>Đăng ký</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
