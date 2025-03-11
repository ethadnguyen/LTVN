'use client';

import { useEffect, useState } from 'react';
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
import { CategoryRes } from '@/services/types/response/category-res';
import {
  createCategory,
  updateCategory,
  fetchAllCategories,
} from '@/services/modules/categories.service';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categorySchema } from './category-schema';
import { IconPicker } from '@/components/ui/icon-picker';
import '@flaticon/flaticon-uicons/css/all/all.css';

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  category?: CategoryRes | null;
  onRefresh?: () => void;
}

export function CategoryDialog({
  open,
  onClose,
  category,
  onRefresh,
}: CategoryDialogProps) {
  const { toast } = useToast();
  const isUpdate = !!category;
  const [parentCategories, setParentCategories] = useState<CategoryRes[]>([]);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      icon: '',
      parent_id: null,
      is_active: true,
    },
  });

  const flattenCategories = (categories: CategoryRes[]): CategoryRes[] => {
    // Sử dụng Set để theo dõi các ID đã xử lý
    const processedIds = new Set<string | number>();
    const flat: CategoryRes[] = [];

    const processCategory = (cat: CategoryRes) => {
      // Nếu ID đã được xử lý, bỏ qua
      if (processedIds.has(cat.id)) return;

      // Thêm ID vào danh sách đã xử lý
      processedIds.add(cat.id);
      flat.push(cat);

      // Xử lý các danh mục con
      if (cat.children && cat.children.length > 0) {
        cat.children.forEach(processCategory);
      }
    };

    categories.forEach(processCategory);
    return flat;
  };

  const fetchParentCategories = async () => {
    try {
      const result = await fetchAllCategories({ size: 1000 });
      console.log('Danh mục từ API:', result.data);
      if (result.status === 200) {
        // Làm phẳng toàn bộ cây danh mục (đã loại bỏ trùng lặp)
        const allCategories = flattenCategories(result.data.categories);

        if (isUpdate && category) {
          const currentId = Number(category.id);

          // Lọc bỏ danh mục hiện tại và các danh mục con của nó
          const filteredCategories = allCategories.filter((cat) => {
            const catId = Number(cat.id);
            if (catId === currentId) return false;

            // Kiểm tra xem cat có phải là con của currentId không
            const isDescendant = (
              category: CategoryRes,
              ancestorId: number
            ): boolean => {
              if (!category.parent) return false;
              if (Number(category.parent.id) === ancestorId) return true;
              return isDescendant(category.parent, ancestorId);
            };

            return !isDescendant(cat, currentId);
          });

          setParentCategories(filteredCategories);
        } else {
          // Khi tạo mới, sử dụng tất cả danh mục
          setParentCategories(allCategories);
        }
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh mục cha:', error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchParentCategories();
    }
  }, [open]);

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description || '',
        icon: category.icon || '',
        parent_id: category.parent ? Number(category.parent.id) : null,
        is_active: category.is_active,
      });
      console.log(
        'Đặt parent_id:',
        category.parent ? Number(category.parent.id) : null
      );
    } else {
      form.reset({
        name: '',
        description: '',
        icon: '',
        parent_id: null,
        is_active: true,
      });
    }
  }, [category, form]);

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      if (isUpdate && category) {
        const updateData = {
          id: Number(category.id),
          name: data.name,
          description: data.description || '',
          icon: data.icon || '',
          parent_id: Number(data.parent_id) || null,
          is_active: data.is_active,
        };

        await updateCategory(updateData);

        toast({
          title: 'Thành công',
          description: 'Cập nhật danh mục thành công',
        });
      } else {
        await createCategory({
          name: data.name,
          description: data.description || '',
          icon: data.icon || '',
          parent_id: Number(data.parent_id),
          is_active: data.is_active,
        });
        toast({
          title: 'Thành công',
          description: 'Thêm danh mục mới thành công',
        });
        form.reset({
          name: '',
          description: '',
          icon: '',
          parent_id: null,
          is_active: true,
        });
      }
      onRefresh?.();
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu danh mục',
        variant: 'destructive',
      });
    }
  };

  // Render icon được chọn
  const selectedIconName = form.watch('icon');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid gap-2'>
            <Label htmlFor='name'>Tên danh mục</Label>
            <Input
              id='name'
              placeholder='Nhập tên danh mục'
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <p className='text-sm text-destructive'>
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='icon'>Icon</Label>
            <div className='flex gap-2 items-center'>
              <div className='flex-1'>
                <IconPicker
                  value={form.watch('icon')}
                  onChange={(value) => form.setValue('icon', value)}
                />
              </div>
              {selectedIconName && (
                <div className='flex items-center justify-center w-10 h-10 border rounded-md'>
                  <i className={`${selectedIconName} text-xl`}></i>
                </div>
              )}
            </div>
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='parent_id'>Danh mục cha</Label>
            <Select
              value={
                form.watch('parent_id') === null
                  ? 'null'
                  : String(form.watch('parent_id'))
              }
              onValueChange={(value) => {
                form.setValue(
                  'parent_id',
                  value === 'null' ? null : parseInt(value)
                );
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder='Chọn danh mục cha (nếu có)' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='null'>Không có</SelectItem>
                {parentCategories.map((cat) => (
                  <SelectItem key={`category-${cat.id}`} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='description'>Mô tả</Label>
            <Textarea
              id='description'
              placeholder='Nhập mô tả về danh mục'
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
