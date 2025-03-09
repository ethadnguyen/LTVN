'use client';

import type React from 'react';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingsCount?: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingsCount = 1,
  className,
  ...props
}: PaginationProps) {
  // Tạo mảng các trang cần hiển thị
  const generatePagination = () => {
    // Luôn hiển thị trang đầu và trang cuối
    const firstPage = 1;
    const lastPage = totalPages;

    // Tính toán phạm vi trang hiển thị xung quanh trang hiện tại
    const leftSiblingIndex = Math.max(currentPage - siblingsCount, firstPage);
    const rightSiblingIndex = Math.min(currentPage + siblingsCount, lastPage);

    // Xác định xem có cần hiển thị dấu "..." bên trái và bên phải không
    const shouldShowLeftDots = leftSiblingIndex > firstPage + 1;
    const shouldShowRightDots = rightSiblingIndex < lastPage - 1;

    // Tạo mảng các trang cần hiển thị
    const pages: (number | string)[] = [];

    // Luôn thêm trang đầu tiên
    pages.push(firstPage);

    // Thêm dấu "..." bên trái nếu cần
    if (shouldShowLeftDots) {
      pages.push('left-dots');
    }

    // Thêm các trang xung quanh trang hiện tại
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== firstPage && i !== lastPage) {
        pages.push(i);
      }
    }

    // Thêm dấu "..." bên phải nếu cần
    if (shouldShowRightDots) {
      pages.push('right-dots');
    }

    // Luôn thêm trang cuối cùng nếu có nhiều hơn 1 trang
    if (lastPage > firstPage) {
      pages.push(lastPage);
    }

    return pages;
  };

  const pages = generatePagination();

  return (
    <nav
      aria-label='Pagination'
      className={cn('flex justify-center', className)}
      {...props}
    >
      <ul className='flex items-center gap-1'>
        <li>
          <Button
            variant='outline'
            size='icon'
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            aria-label='Trang trước'
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
        </li>

        {pages.map((page, index) => {
          if (page === 'left-dots' || page === 'right-dots') {
            return (
              <li key={`dots-${index}`}>
                <span className='flex h-9 w-9 items-center justify-center'>
                  <MoreHorizontal className='h-4 w-4 text-muted-foreground' />
                </span>
              </li>
            );
          }

          const pageNumber = page as number;
          const isCurrentPage = pageNumber === currentPage;

          return (
            <li key={pageNumber}>
              <Button
                variant={isCurrentPage ? 'default' : 'outline'}
                size='icon'
                onClick={() => onPageChange(pageNumber)}
                aria-current={isCurrentPage ? 'page' : undefined}
                aria-label={`Trang ${pageNumber}`}
                className='h-9 w-9'
              >
                {pageNumber}
              </Button>
            </li>
          );
        })}

        <li>
          <Button
            variant='outline'
            size='icon'
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            aria-label='Trang sau'
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
        </li>
      </ul>
    </nav>
  );
}
