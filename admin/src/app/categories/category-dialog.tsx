'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Trash } from 'lucide-react';
import { CategoryRes } from '@/services/types/response/category-res';
import { CategorySelect } from '@/components/category/category-select';
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from '@/services/modules/categories.service';
import { categorySchema, type CategoryFormValues } from './category-schema';
import { successMessage, errorMessage } from '@/common/message';

interface CategoryDialogProps {
  open?: boolean;
  isUpdate?: boolean;
  onClose?: () => void;
  dataReq: CategoryRes | null;
  fetchData: () => void;
  fetchCategories: () => void;
  categories: CategoryRes[];
}

const CategoryDialog: React.FC<CategoryDialogProps> = ({
  open,
  isUpdate,
  onClose,
  dataReq,
  fetchData,
  fetchCategories,
  categories,
}) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      is_active: true,
      parent_id: null,
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (isUpdate && dataReq) {
      setValue('name', dataReq.name);
      setValue('description', dataReq.description);
      setValue('is_active', dataReq.is_active);
      setValue('parent_id', dataReq.parent?.id);
    }
  }, [isUpdate, dataReq, setValue]);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (data: CategoryFormValues) => {
    setLoading(true);
    try {
      if (isUpdate && dataReq) {
        await updateCategory(Number(dataReq.id), {
          name: data.name,
          description: data.description,
          is_active: data.is_active,
          parent_id: data.parent_id,
        });
        successMessage('Cập nhật danh mục thành công');
      } else {
        await createCategory({
          name: data.name,
          description: data.description,
          is_active: data.is_active,
          parent_id: data.parent_id,
        });
        successMessage('Thêm danh mục thành công');
      }

      // Cập nhật danh sách categories trước khi đóng dialog
      if (fetchCategories) fetchCategories();
      if (fetchData) fetchData();

      if (onClose) onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        errorMessage(error.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      } else {
        errorMessage('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!dataReq) return;
    try {
      await deleteCategory(dataReq.id);
      successMessage('Xóa danh mục thành công');

      // Cập nhật danh sách categories trước khi đóng dialog
      if (fetchCategories) fetchCategories();
      if (fetchData) fetchData();

      if (onClose) onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        errorMessage(error.message || 'Không thể xóa danh mục');
      } else {
        errorMessage('Không thể xóa danh mục');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent className='sm:max-w-[500px]'>
        {loading && (
          <div className='absolute inset-0 bg-white/50 flex items-center justify-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
          </div>
        )}
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>Tên danh mục</Label>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      {...field}
                      id='name'
                      placeholder='Nhập tên danh mục'
                    />
                    {errors.name && (
                      <span className='text-sm text-red-500'>
                        {errors.name.message}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='description'>Mô tả</Label>
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <div>
                    <Textarea
                      {...field}
                      id='description'
                      placeholder='Nhập mô tả'
                    />
                    {errors.description && (
                      <span className='text-sm text-red-500'>
                        {errors.description.message}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>

            <div className='flex items-center space-x-2'>
              <Controller
                name='is_active'
                control={control}
                render={({ field }) => (
                  <Switch
                    id='is_active'
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor='is_active'>Hoạt động</Label>
            </div>

            <div className='grid gap-2'>
              <Label>Danh mục cha</Label>
              <Controller
                name='parent_id'
                control={control}
                render={({ field }) => (
                  <CategorySelect
                    value={field.value ?? null}
                    onChange={field.onChange}
                    categories={categories}
                    excludeId={isUpdate ? dataReq?.id : undefined}
                    className='w-full'
                    onFocus={fetchCategories}
                    refreshCategories={fetchCategories}
                  />
                )}
              />
            </div>
          </div>

          <DialogFooter>
            {isUpdate && (
              <Button
                type='button'
                variant='outline'
                onClick={handleDelete}
                className='mr-auto'
              >
                <Trash className='mr-2 h-4 w-4' />
                Xóa
              </Button>
            )}
            <Button type='submit' disabled={loading}>
              {loading ? 'Đang xử lý...' : isUpdate ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
