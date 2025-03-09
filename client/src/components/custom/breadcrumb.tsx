import type React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

export function Breadcrumb({
  items,
  separator = <ChevronRight className='h-4 w-4 text-muted-foreground' />,
  className,
  ...props
}: BreadcrumbProps) {
  return (
    <nav
      aria-label='Breadcrumb'
      className={cn('flex items-center text-sm', className)}
      {...props}
    >
      <ol className='flex items-center flex-wrap gap-1.5'>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className='flex items-center'>
              {item.href && !item.active ? (
                <Link
                  href={item.href}
                  className={cn(
                    'text-muted-foreground hover:text-primary transition-colors',
                    item.active &&
                      'text-foreground font-medium pointer-events-none'
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    'text-muted-foreground',
                    item.active && 'text-foreground font-medium'
                  )}
                  aria-current={item.active ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}

              {!isLast && <span className='mx-1.5'>{separator}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
