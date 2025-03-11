'use client';

import * as React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { icons } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface IconPickerProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Chỉ tìm kiếm icon khi có nhập text
  const getMatchingIcons = () => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return Object.keys(icons)
      .filter((name) => name.toLowerCase().includes(query))
      .slice(0, 10); // Giới hạn 10 kết quả
  };

  // Render icon được chọn
  const selectedIconName = value;
  const SelectedIconComponent = selectedIconName
    ? (icons[selectedIconName as keyof typeof icons] as LucideIcon)
    : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
        >
          <div className='flex items-center gap-2'>
            {SelectedIconComponent ? (
              <>
                <SelectedIconComponent className='h-5 w-5' />
                <span>{value}</span>
              </>
            ) : (
              <span>Nhập tên icon...</span>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[300px] p-0'>
        <Command>
          <CommandInput
            placeholder='Nhập tên icon để tìm...'
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>Không tìm thấy icon.</CommandEmpty>
            <CommandGroup className='max-h-[300px] overflow-y-auto'>
              {searchQuery ? (
                getMatchingIcons().map((iconName) => {
                  const IconComponent = icons[
                    iconName as keyof typeof icons
                  ] as LucideIcon;
                  return (
                    <CommandItem
                      key={iconName}
                      value={iconName}
                      onSelect={() => {
                        onChange?.(iconName);
                        setOpen(false);
                        setSearchQuery('');
                      }}
                      className='flex items-center gap-2 cursor-pointer'
                    >
                      <IconComponent className='h-5 w-5' />
                      <span>{iconName}</span>
                    </CommandItem>
                  );
                })
              ) : (
                <div className='p-2 text-center text-sm text-muted-foreground'>
                  Nhập tên icon để tìm kiếm...
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
