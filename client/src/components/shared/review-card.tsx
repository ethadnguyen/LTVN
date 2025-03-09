import { Star, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ReviewCardProps {
  id: string;
  author: string;
  avatar?: string;
  date: string;
  rating: number;
  content: string;
}

export function ReviewCard({
  id,
  author,
  avatar,
  date,
  rating,
  content,
}: ReviewCardProps) {
  return (
    <div className='space-y-4 rounded-lg border p-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Avatar>
            {avatar && <AvatarImage src={avatar} alt={author} />}
            <AvatarFallback>
              <User className='h-4 w-4' />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className='font-medium'>{author}</p>
            <p className='text-xs text-muted-foreground'>{date}</p>
          </div>
        </div>
        <div className='flex'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating
                  ? 'fill-primary text-primary'
                  : 'fill-muted text-muted'
              }`}
            />
          ))}
        </div>
      </div>
      <p className='text-sm text-card-foreground'>{content}</p>
    </div>
  );
}
