import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SpecCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const SpecCard: React.FC<SpecCardProps> = ({
  title,
  icon,
  children,
  className,
}) => {
  return (
    <Card className={cn('shadow-sm', className)}>
      <CardHeader className='pb-2'>
        <CardTitle className='text-lg flex items-center gap-2'>
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

interface SpecRowProps {
  label: string;
  value: string | number | boolean | React.ReactNode;
  highlight?: boolean;
}

export const SpecRow: React.FC<SpecRowProps> = ({
  label,
  value,
  highlight = false,
}) => {
  return (
    <div className='flex justify-between py-2 border-b last:border-0'>
      <span className='font-medium text-muted-foreground'>{label}</span>
      <span className={cn(highlight && 'font-semibold text-primary')}>
        {typeof value === 'boolean' ? (value ? 'Có' : 'Không') : value}
      </span>
    </div>
  );
};

interface SpecBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const SpecBadge: React.FC<SpecBadgeProps> = ({
  children,
  className,
}) => {
  return (
    <Badge variant='outline' className={cn('mr-1 mb-1', className)}>
      {children}
    </Badge>
  );
};
