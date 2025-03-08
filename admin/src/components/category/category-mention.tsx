'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CategoryRes } from '@/services/types/response/category-res';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategorySelectProps {
  value: string[] | number[];
  onChange: (value: string[]) => void;
  categories: CategoryRes[];
  excludeId?: number;
  className?: string;
  loading?: boolean;
}

export function CategoryMention({
  value,
  onChange,
  categories = [],
  excludeId,
  className,
  loading = false,
}: CategorySelectProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const numericValue = React.useMemo(() => {
    if (!value) return [];
    return Array.isArray(value)
      ? value.map((id) => (typeof id === 'string' ? Number(id) : Number(id)))
      : [];
  }, [value]);

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

  const selectedCategories = React.useMemo(() => {
    if (!categories || categories.length === 0 || numericValue.length === 0)
      return [];
    return numericValue
      .map((id) => categories.find((cat) => Number(cat.id) === id))
      .filter(Boolean) as CategoryRes[];
  }, [categories, numericValue]);

  const suggestedCategories = React.useMemo(() => {
    if (!availableCategories || availableCategories.length === 0) return [];
    if (!searchTerm.trim()) return availableCategories;

    return availableCategories.filter(
      (cat) =>
        !numericValue.includes(Number(cat.id)) &&
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableCategories, searchTerm, numericValue]);

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

  const handleAddCategory = (categoryId: number | string) => {
    const numericId = Number(categoryId);
    const stringId = String(categoryId);

    if (!numericValue.includes(numericId)) {
      const newStringValues = [
        ...numericValue.map((id) => String(id)),
        stringId,
      ];
      onChange(newStringValues);
    }

    setSearchTerm('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleRemoveCategory = (categoryId: number | string) => {
    const numericId = Number(categoryId);

    const newStringValues = numericValue
      .filter((id) => id !== numericId)
      .map((id) => String(id));

    onChange(newStringValues);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === 'Enter' &&
      showSuggestions &&
      suggestedCategories.length > 0
    ) {
      e.preventDefault();
      handleAddCategory(suggestedCategories[0].id);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  if (loading) {
    return <div className='h-10 animate-pulse bg-muted rounded-md' />;
  }

  if (!mounted) {
    return (
      <div className={cn('relative', className)}>
        <div className='flex flex-wrap gap-2 p-2 border rounded-md min-h-10 items-center bg-background'>
          <div className='flex-1 min-w-[120px]'>
            <Input
              placeholder='Tìm kiếm danh mục...'
              className='border-0 shadow-none focus-visible:ring-0 p-0 h-7'
              disabled
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      <div className='flex flex-wrap gap-2 p-2 border rounded-md min-h-10 items-center bg-background'>
        {selectedCategories.map((category) => (
          <Badge
            key={category.id}
            variant='secondary'
            className='flex items-center gap-1 px-2 py-1'
          >
            {category.name}
            <X
              className='h-3 w-3 cursor-pointer hover:text-destructive'
              onClick={() => handleRemoveCategory(category.id)}
            />
          </Badge>
        ))}
        <div className='flex-1 min-w-[120px]'>
          <Input
            ref={inputRef}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value.trim() !== '') {
                setShowSuggestions(true);
              }
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedCategories.length > 0
                ? 'Thêm danh mục...'
                : 'Tìm kiếm danh mục...'
            }
            className='border-0 shadow-none focus-visible:ring-0 p-0 h-7'
          />
        </div>
      </div>

      {mounted && showSuggestions && suggestedCategories.length > 0 && (
        <div className='absolute z-10 w-full mt-1 bg-background border rounded-md shadow-md max-h-60 overflow-y-auto'>
          {suggestedCategories.map((category) => (
            <div
              key={category.id}
              className='p-2 hover:bg-accent cursor-pointer flex items-center gap-2'
              onClick={() => handleAddCategory(category.id)}
            >
              <Plus className='h-4 w-4 text-muted-foreground' />
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
