'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageGalleryProps {
  images: {
    src: string;
    alt: string;
  }[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images.length) return null;

  return (
    <div className='space-y-4'>
      <div className='relative aspect-square overflow-hidden rounded-lg border'>
        <Image
          src={images[currentIndex].src || '/placeholder.svg'}
          alt={images[currentIndex].alt}
          fill
          className='object-contain'
        />
        <Button
          variant='outline'
          size='icon'
          className='absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm'
          onClick={goToPrevious}
        >
          <ChevronLeft className='h-4 w-4' />
          <span className='sr-only'>Ảnh trước</span>
        </Button>
        <Button
          variant='outline'
          size='icon'
          className='absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm'
          onClick={goToNext}
        >
          <ChevronRight className='h-4 w-4' />
          <span className='sr-only'>Ảnh sau</span>
        </Button>
      </div>
      <div className='flex space-x-2 overflow-auto pb-2'>
        {images.map((image, index) => (
          <button
            key={index}
            className={`relative aspect-square h-20 w-20 overflow-hidden rounded-md border ${
              index === currentIndex ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => goToImage(index)}
          >
            <Image
              src={image.src || '/placeholder.svg'}
              alt={image.alt}
              fill
              className='object-cover'
            />
          </button>
        ))}
      </div>
    </div>
  );
}
