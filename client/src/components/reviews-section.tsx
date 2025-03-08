'use client';

import type React from 'react';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Review {
  id: string;
  rating: number;
  comment: string;
  author: string;
  date: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
  onSubmitReview: (comment: string, rating: number) => void;
}

export function ReviewsSection({
  reviews,
  onSubmitReview,
}: ReviewsSectionProps) {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() && rating > 0) {
      onSubmitReview(comment, rating);
      setComment('');
      setRating(0);
    }
  };

  return (
    <div className='space-y-8'>
      <h2 className='text-2xl font-bold'>Reviews</h2>

      <div className='grid gap-8 md:grid-cols-2'>
        {/* Reviews list */}
        <div className='space-y-4'>
          {reviews.slice(0, 3).map((review) => (
            <div key={review.id} className='rounded-lg border p-4 space-y-2'>
              <div className='flex gap-0.5'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? 'fill-primary'
                        : 'fill-muted stroke-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <p className='text-sm text-muted-foreground'>{review.comment}</p>
              <div className='flex justify-between text-xs text-muted-foreground'>
                <span>{review.author}</span>
                <span>{review.date}</span>
              </div>
            </div>
          ))}
          {reviews.length > 3 && (
            <Button variant='link' className='p-0'>
              See more
            </Button>
          )}
        </div>

        {/* Review form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <Textarea
            placeholder='Write your review...'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className='min-h-[100px]'
          />
          <div className='flex gap-0.5' onMouseLeave={() => setHoveredStar(0)}>
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type='button'
                onMouseEnter={() => setHoveredStar(i + 1)}
                onClick={() => setRating(i + 1)}
              >
                <Star
                  className={cn(
                    'h-6 w-6 transition-colors',
                    i < rating || i < hoveredStar
                      ? 'fill-primary'
                      : 'fill-muted stroke-muted-foreground'
                  )}
                />
              </button>
            ))}
          </div>
          <Button type='submit' className='w-full'>
            Submit Review
          </Button>
        </form>
      </div>
    </div>
  );
}
