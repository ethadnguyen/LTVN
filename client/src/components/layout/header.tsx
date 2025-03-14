'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
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
import { getActiveCategories } from '@/services/modules/category.service';
import { useCartStore } from '@/store/useCartStore';
import { useUserStore } from '@/store/useUserStore';

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // State để lưu trữ danh mục từ API
  const [categories, setCategories] = useState<CategoryRes[]>([]);

  // Sử dụng useUserStore để kiểm tra trạng thái đăng nhập
  const { isAuthenticated, logout } = useUserStore();

  // Sử dụng useCartStore để lấy thông tin giỏ hàng
  const { cart, fetchCart } = useCartStore();

  // Lấy danh mục từ API khi component được mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getActiveCategories({
          is_active: true,
          size: 1000,
        });
        setCategories(categoriesData.categories || []);
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
      }
    };

    fetchCategories();
  }, []);

  // Lấy thông tin giỏ hàng từ API khi đăng nhập hoặc khi component được mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  // Số lượng sản phẩm trong giỏ hàng
  const cartItemCount = cart?.item_count || 0;

  // Xử lý đăng xuất
  const handleLogout = () => {
    logout();
  };

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
                  href='/builder'
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
            href='/builder'
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

          {isAuthenticated ? (
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
                <DropdownMenuItem onClick={handleLogout}>
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
                  <Link href='/auth/sign-in'>Đăng nhập</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href='/auth/sign-up'>Đăng ký</Link>
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
