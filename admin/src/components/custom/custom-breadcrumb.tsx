'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface CustomBreadcrumbProps {
  items: BreadcrumbItem[];
}

const CustomBreadcrumb: React.FC<CustomBreadcrumbProps> = ({ items }) => {
  const displayItems = items.slice(0, 3);

  return (
    <nav aria-label='Breadcrumb'>
      <ol className='flex items-center space-x-2'>
        {displayItems.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <li className='flex items-center'>
                <ChevronRight className='h-4 w-4 text-gray-500' />
              </li>
            )}
            <li>
              {item.href && index < displayItems.length - 1 ? (
                <Link
                  href={item.href}
                  className='text-foreground hover:underline'
                >
                  {item.label}
                </Link>
              ) : (
                <span className='text-character text-primary'>
                  {item.label}
                </span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default CustomBreadcrumb;
