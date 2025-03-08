'use client';

import React from 'react';
import CustomPagination from '@/components/custom/custom-pagination';
import { useRouter } from 'next/navigation';

interface PaginationWrapperProps {
  className?: string;
  totalPage?: number;
  onPageChange?: (page: number) => void;
  selectedPage?: number;
  pathName?: string;
}

const PaginationWrapper: React.FC<PaginationWrapperProps> = React.memo(
  ({ className, totalPage, onPageChange, selectedPage, pathName }) => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = React.useState(selectedPage ?? 1);
    const totalPages = totalPage ?? 20;

    const handlePageChange = (page: number) => {
      if (pathName) {
        router.push(pathName + '/' + page);
        return;
      }
      if (onPageChange) onPageChange(page);
      setCurrentPage(page);
    };

    return (
      <CustomPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        className={className}
      />
    );
  }
);

PaginationWrapper.displayName = 'PaginationWrapper';

export default PaginationWrapper;
