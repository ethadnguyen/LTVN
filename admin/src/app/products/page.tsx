'use client';

import { Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/product/product-card';
import { ProductRes } from '@/services/types/response/product-res';
import { fetchAllProducts } from '@/services/modules/product.service';
import { useToast } from '@/hooks/use-toast';
import PaginationWrapper from '@/components/custom/pagination-wrapper';
import ProductDialog from './product-dialog';
import CustomBreadcrumb from '@/components/custom/custom-breadcrumb';
import { PageBody } from '@/components/custom/page-body';
import ImportProductsDialog from './import-products-dialog';

export default function ProductsPage() {
  const [dialog, setDialog] = useState({
    isOpen: false,
    selectedProduct: null as ProductRes | null,
  });

  const [pageData, setPageData] = useState({
    data: [] as ProductRes[],
    currentPage: 1,
    totalPages: 1,
    isLoading: false,
    searchKey: '',
  });

  const { toast } = useToast();

  const [openImportDialog, setOpenImportDialog] = useState(false);

  const fetchData = async () => {
    try {
      setPageData((prev) => ({ ...prev, isLoading: true }));
      const result = await fetchAllProducts({
        page: pageData.currentPage,
        size: 12,
        search: pageData.searchKey,
      });
      if (result.status === 200) {
        setPageData((prev) => ({
          ...prev,
          data: result.data.products,
          totalPages: result.data.totalPages,
        }));
      }
    } catch {
      toast({
        title: 'Thất bại',
        description: 'Không thể tải danh sách sản phẩm',
        variant: 'destructive',
      });
    } finally {
      setPageData((prev) => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageData.currentPage, pageData.searchKey]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleDialog = (
    action: 'add' | 'update' | 'close',
    product?: ProductRes
  ) => {
    setDialog({
      isOpen: action !== 'close',
      selectedProduct: product || null,
    });
  };

  return (
    <>
      <ProductDialog
        open={dialog.isOpen}
        onClose={() => handleDialog('close')}
        product={dialog.selectedProduct}
        isUpdate={!!dialog.selectedProduct}
        onRefresh={fetchData}
      />

      <ImportProductsDialog
        open={openImportDialog}
        onClose={() => setOpenImportDialog(false)}
        onRefresh={fetchData}
      />

      <PageBody>
        <div className='flex flex-col gap-4 col-span-12 md:col-span-12'>
          <CustomBreadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Quản lý sản phẩm' },
            ]}
          />
          <h1 className='text-xl font-medium'>Quản lý sản phẩm</h1>

          <div>
            <div className='grid grid-cols-12'>
              <div className='relative w-full col-span-6'>
                <Input
                  className='pl-9'
                  placeholder='Tìm kiếm sản phẩm...'
                  value={pageData.searchKey}
                  onChange={(e) =>
                    setPageData((prev) => ({
                      ...prev,
                      searchKey: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(e);
                    }
                  }}
                />
                <Search className='absolute left-0 top-0 m-2.5 h-4 w-4 text-muted-foreground' />
              </div>
              <div className='col-span-6 flex justify-end gap-2'>
                <Button onClick={() => setOpenImportDialog(true)}>
                  Import từ file
                </Button>
                <Button onClick={() => handleDialog('add')}>
                  <Plus className='mr-2 h-4 w-4' />
                  Thêm sản phẩm
                </Button>
              </div>
            </div>

            <div className='mt-4'>
              {pageData.isLoading ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className='h-[400px] animate-pulse bg-muted rounded-lg'
                    />
                  ))}
                </div>
              ) : (
                <>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                    {pageData.data.length === 0 ? (
                      <div className='col-span-full flex items-center justify-center h-32 text-muted-foreground'>
                        Không có sản phẩm nào
                      </div>
                    ) : (
                      pageData.data.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onClick={() => handleDialog('update', product)}
                        />
                      ))
                    )}
                  </div>
                  <PaginationWrapper
                    className='justify-end mt-4'
                    totalPage={pageData.totalPages}
                    onPageChange={(page) =>
                      setPageData((prev) => ({ ...prev, currentPage: page }))
                    }
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </PageBody>
    </>
  );
}
