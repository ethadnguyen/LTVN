'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { BrandRes } from '@/services/types/response/brand-res';
import { createBrand, updateBrand } from '@/services/modules/brand.service';

// Schema cho form brand
const brandSchema = z.object({
  name: z.string().min(1, 'Tên hãng không được để trống'),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

type BrandFormValues = z.infer<typeof brandSchema>;

interface BrandDialogProps {
  open: boolean;
  onClose: () => void;
  brand?: BrandRes | null;
  onRefresh?: () => void;
}

export function BrandDialog({
  open,
  onClose,
  brand,
  onRefresh,
}: BrandDialogProps) {
  const { toast } = useToast();
  const isUpdate = !!brand;

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: '',
      description: '',
      is_active: true,
    },
  });

  useEffect(() => {
    if (brand) {
      form.reset({
        name: brand.name,
        description: brand.description || '',
        is_active: brand.is_active,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        is_active: true,
      });
    }
  }, [brand, form]);

  const onSubmit = async (data: BrandFormValues) => {
    try {
      if (isUpdate && brand) {
        await updateBrand({
          id: brand.id,
          ...data,
        });
        toast({
          title: 'Thành công',
          description: 'Cập nhật hãng sản xuất thành công',
        });
      } else {
        await createBrand(data);
        toast({
          title: 'Thành công',
          description: 'Thêm hãng sản xuất mới thành công',
        });
        form.reset({
          name: '',
          description: '',
          is_active: true,
        });
      }
      onRefresh?.();
      onClose();
    } catch (error) {
      console.error('Error saving brand:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu hãng sản xuất',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? 'Cập nhật hãng sản xuất' : 'Thêm hãng sản xuất mới'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid gap-2'>
            <Label htmlFor='name'>Tên hãng</Label>
            <Input
              id='name'
              placeholder='Nhập tên hãng sản xuất'
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <p className='text-sm text-destructive'>
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='description'>Mô tả</Label>
            <Textarea
              id='description'
              placeholder='Nhập mô tả về hãng sản xuất'
              {...form.register('description')}
            />
            {form.formState.errors.description && (
              <p className='text-sm text-destructive'>
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className='flex items-center space-x-2'>
            <Switch
              id='is_active'
              checked={form.watch('is_active')}
              onCheckedChange={(checked) => form.setValue('is_active', checked)}
            />
            <Label htmlFor='is_active'>Kích hoạt</Label>
          </div>

          <div className='flex justify-end space-x-2'>
            <Button type='button' variant='outline' onClick={onClose}>
              Hủy
            </Button>
            <Button type='submit'>{isUpdate ? 'Cập nhật' : 'Thêm mới'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
