'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationWrapperProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function PaginationWrapper({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationWrapperProps) {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const getVisiblePages = () => {
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) return pages;

    const halfVisible = Math.floor(maxVisiblePages / 2);
    let start = currentPage - halfVisible;
    let end = currentPage + halfVisible;

    if (start < 1) {
      start = 1;
      end = maxVisiblePages;
    }

    if (end > totalPages) {
      end = totalPages;
      start = totalPages - maxVisiblePages + 1;
    }

    return pages.slice(start - 1, end);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className='flex items-center justify-center gap-2'>
      <Button
        variant='outline'
        size='icon'
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className='h-4 w-4' />
      </Button>

      {visiblePages[0] > 1 && (
        <>
          <Button
            variant={currentPage === 1 ? 'default' : 'outline'}
            size='icon'
            onClick={() => onPageChange(1)}
          >
            1
          </Button>
          {visiblePages[0] > 2 && <span className='px-2'>...</span>}
        </>
      )}

      {visiblePages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? 'default' : 'outline'}
          size='icon'
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className='px-2'>...</span>
          )}
          <Button
            variant={currentPage === totalPages ? 'default' : 'outline'}
            size='icon'
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant='outline'
        size='icon'
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className='h-4 w-4' />
      </Button>
    </div>
  );
}
