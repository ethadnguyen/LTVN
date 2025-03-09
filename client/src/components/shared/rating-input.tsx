'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingInputProps {
  value?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
}

export function RatingInput({
  value = 0,
  onChange,
  readOnly = false,
}: RatingInputProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const handleMouseEnter = (index: number) => {
    if (readOnly) return;
    setHoverValue(index);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverValue(0);
  };

  const handleClick = (index: number) => {
    if (readOnly) return;
    onChange?.(index);
  };

  return (
    <div className='flex'>
      {[1, 2, 3, 4, 5].map((index) => (
        <Star
          key={index}
          className={`h-6 w-6 cursor-pointer ${
            index <= (hoverValue || value)
              ? 'fill-primary text-primary'
              : 'fill-muted text-muted'
          } ${readOnly ? 'cursor-default' : ''}`}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
}
