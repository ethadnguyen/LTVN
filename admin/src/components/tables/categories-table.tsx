'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CategoryRes } from '@/services/types/response/category-res';
import {
  fetchAllCategories,
  deleteCategory,
} from '@/services/modules/categories.service';
import { successMessage, errorMessage } from '@/common/message';

interface CategoriesTableProps {
  onEdit: (category: CategoryRes) => void;
  data: CategoryRes[];
}

export function CategoriesTable({ onEdit, data }: CategoriesTableProps) {
  const router = useRouter();

  const handleEdit = (category: CategoryRes) => {
    onEdit(category);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      try {
        await deleteCategory(id);
        successMessage('Xóa danh mục thành công');
      } catch (error) {
        errorMessage('Không thể xóa danh mục');
      }
    }
  };

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tên danh mục</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.id}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>
                {category.status ? 'Hoạt động' : 'Không hoạt động'}
              </TableCell>
              <TableCell>
                <div className='flex space-x-2'>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => handleEdit(category)}
                  >
                    <Edit className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='destructive'
                    size='icon'
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
