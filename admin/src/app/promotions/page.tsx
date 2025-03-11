'use client';

import { Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import PaginationWrapper from '@/components/custom/pagination-wrapper';
import CustomBreadcrumb from '@/components/custom/custom-breadcrumb';
import { PageBody } from '@/components/custom/page-body';
import { PromotionRes } from '@/services/types/response/promotion-res';
import {
  fetchAllPromotions,
  deletePromotion,
} from '@/services/modules/promotion.service';
import { PromotionCard } from '@/components/promotion/promotion-card';
import PromotionDialog from './promotion-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function PromotionsPage() {
  const [dialog, setDialog] = useState({
    isOpen: false,
    selectedPromotion: null as PromotionRes | null,
  });

  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    promotionToDelete: null as PromotionRes | null,
  });

  const [pageData, setPageData] = useState({
    data: [] as PromotionRes[],
    currentPage: 1,
    totalPages: 1,
    isLoading: false,
    searchKey: '',
  });

  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setPageData((prev) => ({ ...prev, isLoading: true }));
      const result = await fetchAllPromotions({
        page: pageData.currentPage,
        size: 12,
        search: pageData.searchKey,
      });
      if (result.status === 200) {
        setPageData((prev) => ({
          ...prev,
          data: result.data.promotions,
          totalPages: result.data.totalPages,
        }));
      }
    } catch {
      toast({
        title: 'Thất bại',
        description: 'Không thể tải danh sách khuyến mãi',
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
    promotion?: PromotionRes
  ) => {
    setDialog({
      isOpen: action !== 'close',
      selectedPromotion: promotion || null,
    });
  };

  const handleDeleteDialog = (
    action: 'open' | 'close',
    promotion?: PromotionRes
  ) => {
    setDeleteDialog({
      isOpen: action === 'open',
      promotionToDelete: promotion || null,
    });
  };

  const handleDelete = async () => {
    if (!deleteDialog.promotionToDelete) return;

    try {
      const result = await deletePromotion(deleteDialog.promotionToDelete.id);
      if (result.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Xóa khuyến mãi thành công',
        });
        fetchData();
      }
    } catch {
      toast({
        title: 'Thất bại',
        description: 'Không thể xóa khuyến mãi',
        variant: 'destructive',
      });
    } finally {
      handleDeleteDialog('close');
    }
  };

  return (
    <>
      <PromotionDialog
        open={dialog.isOpen}
        onClose={() => handleDialog('close')}
        promotion={dialog.selectedPromotion}
        isUpdate={!!dialog.selectedPromotion}
        onRefresh={fetchData}
      />

      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(isOpen) => !isOpen && handleDeleteDialog('close')}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa khuyến mãi</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa khuyến mãi này? Hành động này không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PageBody>
        <div className='flex flex-col gap-4 col-span-12 md:col-span-12'>
          <CustomBreadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Quản lý khuyến mãi' },
            ]}
          />
          <h1 className='text-xl font-medium'>Quản lý khuyến mãi</h1>

          <div>
            <div className='grid grid-cols-12'>
              <div className='relative w-full col-span-6'>
                <Input
                  className='pl-9'
                  placeholder='Tìm kiếm khuyến mãi...'
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
                <Button onClick={() => handleDialog('add')}>
                  <Plus className='mr-2 h-4 w-4' />
                  Thêm khuyến mãi
                </Button>
              </div>
            </div>

            <div className='mt-4'>
              {pageData.isLoading ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className='h-[400px] animate-pulse bg-muted rounded-lg'
                    />
                  ))}
                </div>
              ) : (
                <>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {pageData.data.length === 0 ? (
                      <div className='col-span-full flex items-center justify-center h-32 text-muted-foreground'>
                        Không có khuyến mãi nào
                      </div>
                    ) : (
                      pageData.data.map((promotion) => (
                        <PromotionCard
                          key={promotion.id}
                          promotion={promotion}
                          onEdit={(promotion) =>
                            handleDialog('update', promotion)
                          }
                          onDelete={(promotion) =>
                            handleDeleteDialog('open', promotion)
                          }
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
