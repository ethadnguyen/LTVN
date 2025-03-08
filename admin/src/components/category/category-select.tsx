'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CategoryRes } from '@/services/types/response/category-res';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CategorySelectProps {
  value: number | null;
  onChange: (value: number | null) => void;
  categories: CategoryRes[];
  excludeId?: number;
  className?: string;
  loading?: boolean;
  onFocus?: () => void;
  refreshCategories?: () => void;
}

export function CategorySelect({
  value,
  onChange,
  categories = [],
  excludeId,
  className,
  loading = false,
  onFocus,
  refreshCategories,
}: CategorySelectProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && refreshCategories) {
      refreshCategories();
    }
  }, [mounted, refreshCategories]);

  const availableCategories = React.useMemo(() => {
    if (!categories || categories.length === 0) return [];
    if (!excludeId) return categories;

    const isDescendant = (category: CategoryRes, targetId: number): boolean => {
      if (category.id === targetId) return true;
      return (
        category.children?.some((child) => isDescendant(child, targetId)) ||
        false
      );
    };

    return categories.filter(
      (cat) => cat.id !== excludeId && !isDescendant(cat, excludeId)
    );
  }, [categories, excludeId]);

  const selectedCategory = React.useMemo(() => {
    if (!categories || categories.length === 0 || value === null) return null;
    return categories.find((cat) => Number(cat.id) === Number(value)) || null;
  }, [categories, value]);

  const suggestedCategories = React.useMemo(() => {
    if (!availableCategories || availableCategories.length === 0) return [];
    if (!searchTerm.trim()) return availableCategories;

    return availableCategories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableCategories, searchTerm]);

  useEffect(() => {
    if (!mounted) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mounted]);

  const handleSelectCategory = (categoryId: number) => {
    onChange(categoryId);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleRemoveCategory = () => {
    onChange(null);
    setSearchTerm('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === 'Enter' &&
      showSuggestions &&
      suggestedCategories.length > 0
    ) {
      e.preventDefault();
      handleSelectCategory(suggestedCategories[0].id);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleShowSuggestions = () => {
    if (refreshCategories) {
      refreshCategories();
    }
    setShowSuggestions(true);
  };

  if (loading) {
    return <div className='h-10 animate-pulse bg-muted rounded-md' />;
  }

  if (!mounted) {
    return (
      <div className={cn('relative', className)}>
        <Button variant='outline' className='w-full justify-between' disabled>
          <span>Chọn danh mục...</span>
          <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      {selectedCategory ? (
        <div className='flex items-center gap-2 p-2 border rounded-md bg-background'>
          <Badge variant='secondary' className='flex-1'>
            {selectedCategory.name}
          </Badge>
          <X
            className='h-4 w-4 cursor-pointer hover:text-destructive'
            onClick={handleRemoveCategory}
          />
        </div>
      ) : (
        <div className='flex items-center p-2 border rounded-md bg-background'>
          <Input
            ref={inputRef}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleShowSuggestions();
            }}
            onFocus={() => {
              handleShowSuggestions();
              if (onFocus) onFocus();
            }}
            onKeyDown={handleKeyDown}
            placeholder='Tìm kiếm danh mục...'
            className='border-0 shadow-none focus-visible:ring-0 p-0 h-7'
          />
          <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </div>
      )}

      {mounted && showSuggestions && suggestedCategories.length > 0 && (
        <div className='absolute z-10 w-full mt-1 bg-background border rounded-md shadow-md max-h-60 overflow-y-auto'>
          {suggestedCategories.map((category) => (
            <div
              key={category.id}
              className='p-2 hover:bg-accent cursor-pointer'
              onClick={() => handleSelectCategory(Number(category.id))}
            >
              {category.name}
            </div>
          ))}
        </div>
      )}

      {mounted &&
        showSuggestions &&
        suggestedCategories.length === 0 &&
        searchTerm.trim() !== '' && (
          <div className='absolute z-10 w-full mt-1 bg-background border rounded-md shadow-md p-2 text-center text-muted-foreground'>
            Không tìm thấy danh mục phù hợp
          </div>
        )}
    </div>
  );
}
