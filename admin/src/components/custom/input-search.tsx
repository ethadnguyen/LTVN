'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputSearchProps {
  placeholder?: string;
  className?: string;
  onSearchComplete?: () => void;
}

const InputSearch: React.FC<InputSearchProps> = ({
  placeholder = 'Tìm kiếm...',
  className,
  onSearchComplete,
}) => {
  const [query, setQuery] = React.useState<string>('');
  const router = useRouter();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    if (query.trim() !== '') {
      router.push(`/client/search?query=${encodeURIComponent(query)}`);
      onSearchComplete?.();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={cn('relative', className)}>
      <Input
        type='text'
        value={query}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className={cn('bg-white pr-8 focus-visible:ring-stone-50')}
      />
      <Button
        variant='link'
        size='icon'
        onClick={handleSearch}
        className='absolute top-0 right-0'
      >
        <Search className='h-4 w-4' />
      </Button>
    </div>
  );
};

export { InputSearch };
