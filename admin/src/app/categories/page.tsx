'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, icons } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CategoryRes } from '@/services/types/response/category-res';
import {
  fetchAllCategories,
  deleteCategory,
  updateCategory,
} from '@/services/modules/categories.service';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { CategoryDialog } from './category-dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import CustomBreadcrumb from '@/components/custom/custom-breadcrumb';
import { PageBody } from '@/components/custom/page-body';
import PaginationWrapper from '@/components/custom/pagination-wrapper';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { LucideIcon } from 'lucide-react';

interface CategoryListRes {
  categories: CategoryRes[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

const getData = async (
  page: number = 1,
  size: number = 10
): Promise<CategoryListRes | null> => {
  try {
    const result = await fetchAllCategories({
      page,
      size,
    });
    if (result.status === 200) {
      return result.data;
    }
    return null;
  } catch {
    return null;
  }
};

export default function CategoryPage() {
  const [categories, setCategories] = useState<CategoryRes[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryRes | null>(
    null
  );
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const { toast } = useToast();

  const [pageData, setPageData] = useState({
    data: null as CategoryListRes | null,
    currentPage: 1,
    isLoading: false,
    searchKey: '',
  });

  const fetchData = async () => {
    try {
      setPageData((prev) => ({ ...prev, isLoading: true }));
      const result = await getData(pageData.currentPage);
      setPageData((prev) => ({ ...prev, data: result }));
      if (result?.categories) {
        setCategories(result.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách danh mục',
        variant: 'destructive',
      });
    } finally {
      setPageData((prev) => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageData.currentPage]);

  const handleSearch = () => {
    setPageData((prev) => ({ ...prev, currentPage: 1 }));
    fetchData();
  };

  const handleOpenDialog = (category?: CategoryRes) => {
    setSelectedCategory(category || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCategory(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id);
      toast({
        title: 'Thành công',
        description: 'Xóa danh mục thành công',
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa danh mục',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (category: CategoryRes) => {
    try {
      const newActiveState = !category.is_active;

      setCategories((prevCategories) =>
        prevCategories.map((item) =>
          item.id === category.id
            ? { ...item, is_active: newActiveState }
            : item
        )
      );

      await updateCategory({
        id: Number(category.id),
        is_active: newActiveState,
      });

      toast({
        title: 'Thành công',
        description: `Danh mục đã được ${
          newActiveState ? 'kích hoạt' : 'vô hiệu hóa'
        }`,
      });
    } catch (error) {
      console.error('Error toggling category active status:', error);

      setCategories((prevCategories) =>
        prevCategories.map((item) =>
          item.id === category.id
            ? { ...item, is_active: category.is_active }
            : item
        )
      );

      toast({
        title: 'Lỗi',
        description: 'Không thể thay đổi trạng thái danh mục',
        variant: 'destructive',
      });
    }
  };

  // Hàm render icon
  const renderIcon = (iconName: string | null | undefined) => {
    if (!iconName) return null;
    const IconComponent = icons[iconName as keyof typeof icons] as LucideIcon;
    return IconComponent ? <IconComponent className='h-5 w-5' /> : null;
  };

  return (
    <>
      <CategoryDialog
        open={openDialog}
        onClose={handleCloseDialog}
        category={selectedCategory}
        onRefresh={fetchData}
      />

      <ConfirmDialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        title='Xác nhận xóa'
        description='Bạn có chắc chắn muốn xóa danh mục này không? Hành động này không thể hoàn tác.'
        onConfirm={() => {
          if (selectedCategory) {
            handleDelete(selectedCategory.id);
            setOpenConfirmDialog(false);
          }
        }}
      />

      <PageBody>
        <div className='flex flex-col gap-4 col-span-12 md:col-span-12'>
          <CustomBreadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Quản lý danh mục' },
            ]}
          />
          <h1 className='text-xl font-medium'>Quản lý danh mục</h1>

          <div>
            <div className='grid grid-cols-12'>
              <div className='relative w-full col-span-6'>
                <Input
                  className='pl-9'
                  placeholder='Tìm kiếm'
                  value={pageData.searchKey}
                  onChange={(e) =>
                    setPageData((prev) => ({
                      ...prev,
                      searchKey: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />
                <Search className='absolute left-0 top-0 m-2.5 h-4 w-4 text-muted-foreground' />
              </div>
              <div className='col-span-6 flex justify-end'>
                <Button onClick={() => handleOpenDialog()}>
                  <PlusCircle className='mr-2 h-4 w-4' />
                  Thêm danh mục mới
                </Button>
              </div>
            </div>

            <div className='mt-4'>
              <div className='rounded-md border'>
                {pageData.isLoading ? (
                  <div className='flex items-center justify-center h-32 text-muted-foreground'>
                    Đang tải...
                  </div>
                ) : !categories || categories.length === 0 ? (
                  <div className='flex items-center justify-center h-32 text-muted-foreground'>
                    Chưa có danh mục nào
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead className='text-center'>Icon</TableHead>
                        <TableHead>Tên danh mục</TableHead>
                        <TableHead>Danh mục cha</TableHead>
                        <TableHead>Mô tả</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>{category.id}</TableCell>
                          <TableCell className='text-center'>
                            <div className='inline-flex justify-center'>
                              {renderIcon(category.icon)}
                            </div>
                          </TableCell>
                          <TableCell>{category.name}</TableCell>
                          <TableCell>
                            {category.parent
                              ? category.parent.name
                              : 'Không có'}
                          </TableCell>
                          <TableCell>{category.description}</TableCell>
                          <TableCell>
                            <div className='flex items-center'>
                              <Switch
                                checked={category.is_active}
                                onCheckedChange={() =>
                                  handleToggleActive(category)
                                }
                                className='mr-2'
                              />
                              <Badge
                                variant={
                                  category.is_active ? 'default' : 'outline'
                                }
                              >
                                {category.is_active ? 'Hoạt động' : 'Vô hiệu'}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className='flex space-x-2'>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => handleOpenDialog(category)}
                              >
                                Sửa
                              </Button>
                              <Button
                                variant='destructive'
                                size='sm'
                                onClick={() => {
                                  setSelectedCategory(category);
                                  setOpenConfirmDialog(true);
                                }}
                              >
                                Xóa
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
              {pageData.data && pageData.data.totalPages > 1 && (
                <div className='mt-4 flex justify-center'>
                  <PaginationWrapper
                    totalPage={pageData.data.totalPages}
                    selectedPage={pageData.data.currentPage}
                    onPageChange={(page) =>
                      setPageData((prev) => ({ ...prev, currentPage: page }))
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </PageBody>
    </>
  );
}
