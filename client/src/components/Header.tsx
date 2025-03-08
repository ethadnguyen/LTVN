'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, LogOut, LogIn, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { routes } from '../utils/routes';
import { useAuth } from '@/hooks/useAuth';
import { useUserStore } from '@/store/useUserStore';

export default function Header() {
  const { isAuthenticated } = useAuth();
  const { logout } = useUserStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  console.log('isAuthenticated', isAuthenticated);

  const NavItems = () => (
    <>
      <li>
        <Link
          href={routes.products.path}
          className='text-foreground hover:text-primary transition-colors'
        >
          Products
        </Link>
      </li>
      <li>
        <Link
          href={routes.builder.path}
          className='text-foreground hover:text-primary transition-colors'
        >
          PC Builder
        </Link>
      </li>
      {isAuthenticated && (
        <li>
          <Link
            href={routes.savedConfigs.path}
            className='text-foreground hover:text-primary transition-colors'
          >
            Cấu hình
          </Link>
        </li>
      )}
      {isAuthenticated && (
        <li>
          <Link
            href={routes.cart.path}
            className='text-foreground hover:text-primary transition-colors'
          >
            <ShoppingCart className='inline-block' />
          </Link>
        </li>
      )}
      <li>
        {isAuthenticated ? (
          <Button
            variant='ghost'
            className='flex items-center gap-2'
            onClick={logout}
          >
            <LogOut className='h-4 w-4' />
            Logout
          </Button>
        ) : (
          <Button variant='ghost' className='flex items-center gap-2' asChild>
            <Link href={routes.auth.login.path}>
              <LogIn className='h-4 w-4' />
              Login
            </Link>
          </Button>
        )}
      </li>
    </>
  );

  return (
    <header
      className={`sticky top-0 z-50 bg-white shadow-sm border-b transition-shadow duration-300 ${
        isScrolled ? 'shadow-md' : ''
      }`}
    >
      <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
        <Link
          href={routes.home.path}
          className='text-2xl font-bold text-primary'
        >
          TechBuild
        </Link>
        <nav className='hidden md:block'>
          <ul className='flex items-center space-x-6'>
            <NavItems />
          </ul>
        </nav>
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className='md:hidden'>
            <Button variant='ghost' size='icon'>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side='right' className='w-[300px] sm:w-[400px]'>
            <nav>
              <ul className='flex flex-col space-y-4'>
                <NavItems />
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
