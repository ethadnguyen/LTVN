import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Trash2, Edit } from 'lucide-react';
import { AddressResponse } from '@/services/types/response/address_types/address.res';
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
import { useState } from 'react';

interface AddressCardProps {
  address: AddressResponse;
  onEdit?: (address: AddressResponse) => void;
  onDelete?: (address: AddressResponse) => void;
}

export function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(address);
    }
    setShowDeleteConfirm(false);
  };

  // Hiển thị nhãn địa chỉ dựa trên giá trị label
  const getLabelText = (label: string) => {
    switch (label) {
      case 'HOME':
        return 'Nhà riêng';
      case 'OFFICE':
        return 'Văn phòng';
      case 'OTHER':
        return 'Khác';
      default:
        return label;
    }
  };

  return (
    <>
      <Card className='overflow-hidden border border-border'>
        <CardHeader className='bg-muted pb-3'>
          <div className='flex justify-between items-start'>
            <div className='flex items-center gap-2'>
              <Home className='h-5 w-5 text-primary' />
              <CardTitle className='text-lg'>
                {getLabelText(address.label)}
              </CardTitle>
            </div>
            <div className='flex gap-2'>
              {onEdit && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => onEdit(address)}
                >
                  <Edit className='h-4 w-4 mr-1' /> Sửa
                </Button>
              )}
              {onDelete && (
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className='h-4 w-4 mr-1' /> Xóa
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className='pt-4'>
          <div className='space-y-2'>
            <p className='font-medium'>
              {address.street}, {address.ward}, {address.district},{' '}
              {address.province}
            </p>
            {address.note && (
              <div className='text-sm text-muted-foreground italic'>
                <span className='font-medium'>Ghi chú:</span> {address.note}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa địa chỉ</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa địa chỉ này? Hành động này không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
