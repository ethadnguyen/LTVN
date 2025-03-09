'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { CategoryRes } from '@/services/types/response/category_types/category.res';

interface CategoryDropdownProps {
  categories: CategoryRes[];
}

export function CategoryDropdown({ categories }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeParent, setActiveParent] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Lọc ra các danh mục cha (parent === null)
  const parentCategories = categories.filter(
    (cat) => cat.parent === null && cat.is_active
  );

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveParent(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-1 transition-colors hover:text-primary'
      >
        Danh mục
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className='absolute left-0 top-full mt-2 w-64 rounded-md border bg-background shadow-lg z-50'>
          <div className='py-1'>
            {parentCategories.map((category) => (
              <div key={category.id} className='relative group'>
                <div
                  className='flex items-center justify-between px-4 py-2 text-sm hover:bg-muted hover:text-primary cursor-pointer'
                  onMouseEnter={() => setActiveParent(category.id)}
                  onClick={() => {
                    if (category.children.length === 0) {
                      setIsOpen(false);
                    }
                  }}
                >
                  <Link
                    href={`/category/${category.slug}`}
                    className='flex-1'
                    onClick={() => setIsOpen(false)}
                  >
                    {category.name}
                  </Link>
                  {category.children.length > 0 && (
                    <ChevronRight className='h-4 w-4' />
                  )}
                </div>

                {/* Submenu for children */}
                {category.children.length > 0 &&
                  activeParent === category.id && (
                    <div className='absolute left-full top-0 w-64 rounded-md border bg-background shadow-lg'>
                      <div className='py-1'>
                        {category.children
                          .filter((child) => child.is_active)
                          .map((child) => (
                            <Link
                              key={child.id}
                              href={`/category/${child.slug}`}
                              className='block px-4 py-2 text-sm hover:bg-muted hover:text-primary'
                              onClick={() => {
                                setIsOpen(false);
                                setActiveParent(null);
                              }}
                            >
                              {child.name}
                            </Link>
                          ))}
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
