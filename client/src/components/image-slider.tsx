'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageSliderProps {
  images: string[];
}

export function ImageSlider({ images }: ImageSliderProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const next = () => {
    setCurrentImage((current) => (current + 1) % images.length);
  };

  const previous = () => {
    setCurrentImage((current) => (current - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImage(index);
  };

  return (
    <div className='space-y-4'>
      <div className='relative aspect-square overflow-hidden rounded-lg'>
        <Button
          variant='ghost'
          size='icon'
          className='absolute left-2 top-1/2 z-10 h-12 w-12 -translate-y-1/2'
          onClick={previous}
        >
          <ChevronLeft className='h-8 w-8' />
        </Button>
        <Image
          src={images[currentImage] || '/placeholder.svg'}
          alt='Product image'
          fill
          className='object-cover'
        />
        <Button
          variant='ghost'
          size='icon'
          className='absolute right-2 top-1/2 z-10 h-12 w-12 -translate-y-1/2'
          onClick={next}
        >
          <ChevronRight className='h-8 w-8' />
        </Button>
      </div>
      <div className='flex gap-4 overflow-auto pb-2'>
        {images.map((image, index) => (
          <button
            key={index}
            className={cn(
              'relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-lg border-2',
              currentImage === index ? 'border-primary' : 'border-transparent'
            )}
            onClick={() => goToImage(index)}
          >
            <Image
              src={image || '/placeholder.svg'}
              alt={`Product thumbnail ${index + 1}`}
              fill
              className='object-cover'
            />
          </button>
        ))}
      </div>
    </div>
  );
}
