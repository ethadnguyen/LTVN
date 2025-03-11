'use client';

import * as React from 'react';
import { CalendarDays, ChevronDown, Package, Tags } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PromotionRes } from '@/services/types/response/promotion-res';

interface PromotionCardProps {
  promotion: PromotionRes;
  onEdit?: (promotion: PromotionRes) => void;
  onDelete?: (promotion: PromotionRes) => void;
}

export function PromotionCard({
  promotion,
  onEdit,
  onDelete,
}: PromotionCardProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const usagePercentage = promotion.usage_limit
    ? (promotion.used_count / promotion.usage_limit) * 100
    : 0;

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDiscount = (type: 'percentage' | 'fixed', value: number) => {
    if (type === 'percentage') {
      return `${value}%`;
    }
    return formatCurrency(value);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  const isActive = () => {
    const now = new Date();
    const startDate = new Date(promotion.start_date);
    const endDate = new Date(promotion.end_date);

    return promotion.is_active && now >= startDate && now <= endDate;
  };

  const getStatus = () => {
    const now = new Date();
    const startDate = new Date(promotion.start_date);
    const endDate = new Date(promotion.end_date);

    if (!promotion.is_active) return 'Đã tắt';
    if (now < startDate) return 'Sắp diễn ra';
    if (now > endDate) return 'Đã kết thúc';
    return 'Đang kích hoạt';
  };

  const getStatusVariant = () => {
    const status = getStatus();
    if (status === 'Đang kích hoạt') return 'default';
    if (status === 'Sắp diễn ra') return 'secondary';
    return 'outline';
  };

  return (
    <Card className='w-full'>
      <CardHeader className='space-y-3'>
        <div className='flex items-start justify-between gap-4'>
          <div className='space-y-1 flex-1'>
            <CardTitle className='line-clamp-1'>{promotion.name}</CardTitle>
            <CardDescription className='line-clamp-2'>
              {promotion.description}
            </CardDescription>
          </div>
          <Badge variant={getStatusVariant()} className='whitespace-nowrap'>
            {getStatus()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Thông tin chính */}
        <div className='grid gap-4 md:grid-cols-2'>
          <div className='space-y-2'>
            <div className='text-sm font-medium'>Giảm giá</div>
            <div className='flex items-center gap-2'>
              <span className='text-2xl font-bold'>
                {formatDiscount(
                  promotion.discount_type,
                  promotion.discount_value
                )}
              </span>
              {promotion.discount_type === 'percentage' &&
                promotion.maximum_discount_amount && (
                  <Badge variant='outline' className='font-normal'>
                    Tối đa {formatCurrency(promotion.maximum_discount_amount)}
                  </Badge>
                )}
            </div>
          </div>
          <div className='space-y-2'>
            <div className='text-sm font-medium'>Thời gian</div>
            <div className='flex flex-col gap-1 text-sm text-muted-foreground'>
              <div className='flex items-center gap-2'>
                <CalendarDays className='h-4 w-4 shrink-0' />
                <span>Bắt đầu: {formatDate(promotion.start_date)}</span>
              </div>
              <div className='flex items-center gap-2'>
                <CalendarDays className='h-4 w-4 shrink-0' />
                <span>Kết thúc: {formatDate(promotion.end_date)}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Điều kiện áp dụng */}
        <div className='space-y-2'>
          <div className='text-sm font-medium'>Điều kiện áp dụng</div>
          <div className='grid gap-2 text-sm text-muted-foreground'>
            <div className='flex items-center justify-between'>
              <span>Giá trị đơn hàng tối thiểu</span>
              <span className='font-medium text-foreground'>
                {formatCurrency(promotion.minimum_order_amount)}
              </span>
            </div>
            {promotion.usage_limit && (
              <div className='flex items-center justify-between'>
                <span>Số lượt sử dụng còn lại</span>
                <span className='font-medium text-foreground'>
                  {promotion.usage_limit - promotion.used_count}/
                  {promotion.usage_limit}
                </span>
              </div>
            )}
          </div>
          {promotion.usage_limit && (
            <Progress value={usagePercentage} className='h-2' />
          )}
        </div>

        <Separator />

        {/* Phạm vi áp dụng */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-medium'>Phạm vi áp dụng</div>
            <CollapsibleTrigger asChild>
              <Button variant='ghost' size='sm' className='w-9 p-0'>
                <ChevronDown
                  className={cn('h-4 w-4 transition-transform', {
                    'rotate-180': isOpen,
                  })}
                />
                <span className='sr-only'>Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className='mt-4 space-y-4'>
            {promotion.categories && promotion.categories.length > 0 && (
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm font-medium'>
                  <Tags className='h-4 w-4' />
                  <span>Danh mục ({promotion.categories.length})</span>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {promotion.categories.map((category) => (
                    <HoverCard key={category.id}>
                      <HoverCardTrigger asChild>
                        <Badge variant='secondary' className='cursor-pointer'>
                          {category.name}
                        </Badge>
                      </HoverCardTrigger>
                      <HoverCardContent className='w-64'>
                        <div className='flex justify-between space-x-4'>
                          <div className='space-y-1'>
                            <h4 className='text-sm font-semibold'>
                              {category.name}
                            </h4>
                            <p className='text-sm text-muted-foreground'>
                              {category.products_count || 0} sản phẩm
                            </p>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ))}
                </div>
              </div>
            )}

            {promotion.products && promotion.products.length > 0 && (
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm font-medium'>
                  <Package className='h-4 w-4' />
                  <span>Sản phẩm ({promotion.products.length})</span>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {promotion.products.map((product) => (
                    <TooltipProvider key={product.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant='outline' className='max-w-[200px]'>
                            <span className='truncate'>{product.name}</span>
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{formatCurrency(product.price)}</p>
                          <p className='text-xs text-muted-foreground'>
                            {product.categories && product.categories.length > 0
                              ? product.categories[0].name
                              : 'Không có danh mục'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
      <CardFooter className='flex justify-between'>
        <Button variant='outline' onClick={() => onEdit && onEdit(promotion)}>
          Chỉnh sửa
        </Button>
        <Button
          variant='destructive'
          onClick={() => onDelete && onDelete(promotion)}
        >
          Xóa
        </Button>
      </CardFooter>
    </Card>
  );
}
