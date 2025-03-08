'use client';

import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface CustomPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  className,
}) => {
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => onPageChange(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        pageNumbers.push(
          <PaginationItem key='ellipsis1'>
            <PaginationEllipsis />
          </PaginationItem>
        );
        pageNumbers.push(
          <PaginationItem key={totalPages}>
            <PaginationLink onClick={() => onPageChange(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (currentPage > totalPages - 4) {
        pageNumbers.push(
          <PaginationItem key={1}>
            <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
          </PaginationItem>
        );
        pageNumbers.push(
          <PaginationItem key='ellipsis2'>
            <PaginationEllipsis />
          </PaginationItem>
        );
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => onPageChange(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      } else {
        pageNumbers.push(
          <PaginationItem key={1}>
            <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
          </PaginationItem>
        );
        pageNumbers.push(
          <PaginationItem key='ellipsis3'>
            <PaginationEllipsis />
          </PaginationItem>
        );
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => onPageChange(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        pageNumbers.push(
          <PaginationItem key='ellipsis4'>
            <PaginationEllipsis />
          </PaginationItem>
        );
        pageNumbers.push(
          <PaginationItem key={totalPages}>
            <PaginationLink onClick={() => onPageChange(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => onPageChange(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return pageNumbers;
  };

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          {totalPages > 1 && currentPage > 1 && (
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            />
          )}
        </PaginationItem>
        {renderPageNumbers()}
        <PaginationItem>
          {totalPages > 1 && currentPage < totalPages && (
            <PaginationNext
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
            />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
