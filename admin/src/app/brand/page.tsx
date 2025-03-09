'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BrandRes } from '@/services/types/response/brand-res';
import {
  fetchAllBrands,
  deleteBrand,
  updateBrand,
} from '@/services/modules/brand.service';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { BrandDialog } from './brand-dialog';
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

interface BrandListRes {
  brands: BrandRes[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

const getData = async (
  page: number = 1,
  size: number = 10
): Promise<BrandListRes | null> => {
  try {
    const result = await fetchAllBrands({
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

export default function BrandPage() {
  const [brands, setBrands] = useState<BrandRes[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<BrandRes | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const { toast } = useToast();

  const [pageData, setPageData] = useState({
    data: null as BrandListRes | null,
    currentPage: 1,
    isLoading: false,
    searchKey: '',
  });

  const fetchData = async () => {
    try {
      setPageData((prev) => ({ ...prev, isLoading: true }));
      const result = await getData(pageData.currentPage);
      setPageData((prev) => ({ ...prev, data: result }));
      if (result?.brands) {
        setBrands(result.brands);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách hãng sản xuất',
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

  const handleOpenDialog = (brand?: BrandRes) => {
    setSelectedBrand(brand || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBrand(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBrand(id);
      toast({
        title: 'Thành công',
        description: 'Xóa hãng sản xuất thành công',
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting brand:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa hãng sản xuất',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (brand: BrandRes) => {
    try {
      const newActiveState = !brand.is_active;

      setBrands((prevBrands) =>
        prevBrands.map((item) =>
          item.id === brand.id ? { ...item, is_active: newActiveState } : item
        )
      );

      await updateBrand({
        id: brand.id,
        is_active: newActiveState,
      });

      toast({
        title: 'Thành công',
        description: `Hãng sản xuất đã được ${
          newActiveState ? 'kích hoạt' : 'vô hiệu hóa'
        }`,
      });
    } catch (error) {
      console.error('Error toggling brand active status:', error);

      setBrands((prevBrands) =>
        prevBrands.map((item) =>
          item.id === brand.id ? { ...item, is_active: brand.is_active } : item
        )
      );

      toast({
        title: 'Lỗi',
        description: 'Không thể thay đổi trạng thái hãng sản xuất',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <BrandDialog
        open={openDialog}
        onClose={handleCloseDialog}
        brand={selectedBrand}
        onRefresh={fetchData}
      />

      <ConfirmDialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        title='Xác nhận xóa'
        description='Bạn có chắc chắn muốn xóa hãng sản xuất này không? Hành động này không thể hoàn tác.'
        onConfirm={() => {
          if (selectedBrand) {
            handleDelete(selectedBrand.id);
            setOpenConfirmDialog(false);
          }
        }}
      />

      <PageBody>
        <div className='flex flex-col gap-4 col-span-12 md:col-span-12'>
          <CustomBreadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Quản lý hãng sản xuất' },
            ]}
          />
          <h1 className='text-xl font-medium'>Quản lý hãng sản xuất</h1>

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
                  Thêm hãng mới
                </Button>
              </div>
            </div>

            <div className='mt-4'>
              <div className='rounded-md border'>
                {pageData.isLoading ? (
                  <div className='flex items-center justify-center h-32 text-muted-foreground'>
                    Đang tải...
                  </div>
                ) : !brands || brands.length === 0 ? (
                  <div className='flex items-center justify-center h-32 text-muted-foreground'>
                    Chưa có hãng sản xuất nào
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Tên hãng</TableHead>
                        <TableHead>Mô tả</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {brands.map((brand) => (
                        <TableRow key={brand.id}>
                          <TableCell>{brand.id}</TableCell>
                          <TableCell>{brand.name}</TableCell>
                          <TableCell>
                            <div className='max-w-[300px] truncate'>
                              {brand.description || 'Không có mô tả'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className='flex items-center'>
                              <Switch
                                checked={brand.is_active}
                                onCheckedChange={() =>
                                  handleToggleActive(brand)
                                }
                              />
                              <Badge
                                className='ml-2'
                                variant={
                                  brand.is_active ? 'default' : 'outline'
                                }
                              >
                                {brand.is_active
                                  ? 'Hoạt động'
                                  : 'Không hoạt động'}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className='flex items-center space-x-2'>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => handleOpenDialog(brand)}
                              >
                                Sửa
                              </Button>
                              <Button
                                variant='destructive'
                                size='sm'
                                onClick={() => {
                                  setSelectedBrand(brand);
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
              {pageData.data && (
                <PaginationWrapper
                  className='justify-end mt-4'
                  totalPage={pageData.data.totalPages}
                  onPageChange={(page) =>
                    setPageData((prev) => ({ ...prev, currentPage: page }))
                  }
                />
              )}
            </div>
          </div>
        </div>
      </PageBody>
    </>
  );
}
