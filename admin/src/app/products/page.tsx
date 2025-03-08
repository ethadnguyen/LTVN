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
      <CustomBreadcrumb
        items={[
          {
            label: 'Trang chủ',
            href: '/',
          },
          {
            label: 'Sản phẩm',
            href: '/products',
          },
        ]}
      />
      <PageBody>
        <div className='flex-1 space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-3xl font-bold tracking-tight'>Sản phẩm</h2>
            <div className='flex items-center space-x-2'>
              <Button onClick={() => setOpenImportDialog(true)}>
                Import từ file
              </Button>
              <Button onClick={() => handleDialog('add')}>
                <Plus className='mr-2 h-4 w-4' />
                Thêm sản phẩm
              </Button>
            </div>
          </div>

          <div className='grid gap-4'>
            <form
              className='flex w-full max-w-sm items-center space-x-2'
              onSubmit={handleSearch}
            >
              <Input
                placeholder='Tìm kiếm sản phẩm...'
                value={pageData.searchKey}
                onChange={(e) =>
                  setPageData((prev) => ({
                    ...prev,
                    searchKey: e.target.value,
                  }))
                }
              />
              <Button type='submit'>
                <Search className='h-4 w-4' />
              </Button>
            </form>

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
                  {pageData.data.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={() => handleDialog('update', product)}
                    />
                  ))}
                </div>
                <PaginationWrapper
                  className='justify-end'
                  totalPage={pageData.totalPages}
                  onPageChange={(page) =>
                    setPageData((prev) => ({ ...prev, currentPage: page }))
                  }
                />
              </>
            )}
          </div>
        </div>
      </PageBody>

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
    </>
  );
}
