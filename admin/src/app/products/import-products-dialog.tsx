'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { ProductType } from '@/services/types/request/product-req';
import {
  createCPU,
  createGPU,
  createPSU,
  createRam,
  createStorage,
  createCooling,
  createMainboard,
  createCase,
} from '@/services/modules/product.service';

import Papa from 'papaparse';

interface ImportProductsDialogProps {
  open: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

export default function ImportProductsDialog({
  open,
  onClose,
  onRefresh,
}: ImportProductsDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn file để import',
        variant: 'destructive',
      });
      return;
    }

    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (fileType !== 'json' && fileType !== 'csv') {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn file JSON hoặc CSV',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          let products = [];
          if (fileType === 'json') {
            const jsonData = JSON.parse(e.target?.result as string);
            products = Array.isArray(jsonData.products)
              ? jsonData.products
              : [jsonData];
          } else if (fileType === 'csv') {
            const csvData = Papa.parse(e.target?.result as string, {
              header: true,
              skipEmptyLines: true,
            });
            products = csvData.data;
          }
          await importProducts(products);
        } catch (error) {
          toast({
            title: 'Lỗi',
            description: 'File không hợp lệ',
            variant: 'destructive',
          });
        }
      };

      reader.readAsText(file);
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi đọc file',
        variant: 'destructive',
      });
      console.error('Import error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const importProducts = async (products: any[]) => {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const product of products) {
      try {
        let response;
        switch (product.type) {
          case ProductType.CPU:
            response = await createCPU(product);
            break;
          case ProductType.GPU:
            response = await createGPU(product);
            break;
          case ProductType.POWER_SUPPLY:
            response = await createPSU(product);
            break;
          case ProductType.RAM:
            response = await createRam(product);
            break;
          case ProductType.STORAGE:
            response = await createStorage(product);
            break;
          case ProductType.COOLING:
            response = await createCooling(product);
            break;
          case ProductType.MAINBOARD:
            response = await createMainboard(product);
            break;
          case ProductType.CASE:
            response = await createCase(product);
            break;
          default:
            throw new Error(`Loại sản phẩm không hợp lệ: ${product.type}`);
        }

        if (response?.status === 201) {
          results.success++;
        } else {
          results.failed++;
          results.errors.push(`Lỗi khi tạo sản phẩm ${product.name}`);
        }
      } catch (error) {
        results.failed++;
        results.errors.push(
          `Lỗi khi tạo sản phẩm ${product.name}: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        );
      }
    }

    toast({
      title: 'Kết quả import',
      description: `Thành công: ${results.success}, Thất bại: ${results.failed}`,
      variant: results.failed > 0 ? 'destructive' : 'default',
    });

    if (results.errors.length > 0) {
      console.error('Import errors:', results.errors);
    }

    if (results.success > 0) {
      onRefresh?.();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Import sản phẩm từ file</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='grid gap-2'>
            <Input
              type='file'
              accept='.json, .csv'
              onChange={handleFileChange}
              disabled={isLoading}
            />
            <p className='text-sm text-gray-500'>
              Hỗ trợ file JSON (.json) và CSV (.csv)
            </p>
          </div>

          <div className='flex justify-end space-x-2'>
            <Button variant='outline' onClick={onClose} disabled={isLoading}>
              Hủy
            </Button>
            <Button onClick={handleImport} disabled={isLoading || !file}>
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
