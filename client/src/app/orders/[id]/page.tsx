'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  ArrowLeft,
  ShoppingBag,
  Truck,
  CheckCircle,
  MapPin,
  Edit,
} from 'lucide-react';
import { getOrderById, updateOrder } from '@/services/modules/order.service';
import { useToast } from '@/hooks/use-toast';
import {
  OrderStatus,
  OrderResponse,
  OrderItemResponse,
} from '@/services/types/response/order_types/order.res';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useUserStore } from '@/store/useUserStore';
import { AddressDialog } from '@/components/address/address-dialog';
import { PlacePrediction } from '@/services/types/response/address_types/address.res';
import { AddressFormValues } from '@/components/address/address-dialog';

const OrderStatusProgress = ({ status }: { status: OrderStatus }) => {
  const getStatusIndex = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 0;
      case OrderStatus.SHIPPING:
        return 1;
      case OrderStatus.COMPLETED:
        return 2;
      case OrderStatus.CANCELLED:
        return -1; // Trạng thái hủy không nằm trong tiến trình
      default:
        return 0;
    }
  };

  const statusIndex = getStatusIndex(status);

  // Nếu đơn hàng đã bị hủy, hiển thị thông báo riêng
  if (status === OrderStatus.CANCELLED) {
    return (
      <div className='flex flex-col items-center'>
        <Badge variant='destructive' className='mb-2'>
          Đã hủy
        </Badge>
        <p className='text-sm text-muted-foreground'>Đơn hàng đã bị hủy</p>
      </div>
    );
  }

  return (
    <div className='w-full'>
      <div className='flex justify-between mb-2'>
        <div className='flex flex-col items-center'>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              statusIndex >= 0
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <ShoppingBag className='h-5 w-5' />
          </div>
          <span className='text-xs mt-1'>Đặt hàng</span>
        </div>
        <div
          className={`flex-1 h-1 self-center ${
            statusIndex >= 1 ? 'bg-primary' : 'bg-muted'
          }`}
        />
        <div className='flex flex-col items-center'>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              statusIndex >= 1
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <Truck className='h-5 w-5' />
          </div>
          <span className='text-xs mt-1'>Vận chuyển</span>
        </div>
        <div
          className={`flex-1 h-1 self-center ${
            statusIndex >= 2 ? 'bg-primary' : 'bg-muted'
          }`}
        />
        <div className='flex flex-col items-center'>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              statusIndex >= 2
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <CheckCircle className='h-5 w-5' />
          </div>
          <span className='text-xs mt-1'>Hoàn thành</span>
        </div>
      </div>
    </div>
  );
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const { toast } = useToast();
  const { user } = useUserStore();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        const data = await getOrderById(Number(orderId));
        setOrder(data);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin đơn hàng:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể lấy thông tin đơn hàng',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, toast]);

  // Hàm xử lý hủy đơn hàng
  const handleCancelOrder = async () => {
    try {
      setIsCancelling(true);

      // Sử dụng hàm updateOrder từ order.service
      await updateOrder(Number(orderId), {
        id: Number(orderId),
        status: OrderStatus.CANCELLED,
      });

      // Cập nhật trạng thái đơn hàng trong state
      setOrder((prevOrder) => {
        if (!prevOrder) return null;
        return {
          ...prevOrder,
          status: OrderStatus.CANCELLED,
        };
      });

      toast({
        title: 'Thành công',
        description: 'Đơn hàng đã được hủy',
      });
    } catch (error) {
      console.error('Lỗi khi hủy đơn hàng:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể hủy đơn hàng. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    } finally {
      setIsCancelling(false);
    }
  };

  // Hàm xử lý cập nhật địa chỉ
  const handleUpdateAddress = async (
    addressData: AddressFormValues,
    selectedPlace: PlacePrediction
  ) => {
    try {
      setIsUpdatingAddress(true);

      // Kiểm tra nếu đơn hàng không ở trạng thái PENDING
      if (order?.status !== OrderStatus.PENDING) {
        toast({
          title: 'Không thể cập nhật',
          description:
            'Chỉ có thể thay đổi địa chỉ khi đơn hàng đang chờ xử lý',
          variant: 'destructive',
        });
        return;
      }

      if (!user?.user_id) {
        toast({
          title: 'Lỗi',
          description: 'Bạn cần đăng nhập để thực hiện thao tác này',
          variant: 'destructive',
        });
        return;
      }

      // Sử dụng hàm updateOrder từ order.service
      const updatedOrder = await updateOrder(Number(orderId), {
        id: Number(orderId),
        status: order.status,
        new_address: {
          label: addressData.label,
          province: addressData.province,
          district: addressData.district,
          ward: addressData.ward,
          street: addressData.street,
          note: addressData.note || '',
          place_id: selectedPlace.place_id,
          user_id: user.user_id,
        },
      });

      // Cập nhật đơn hàng trong state
      setOrder(updatedOrder);

      toast({
        title: 'Thành công',
        description: 'Địa chỉ giao hàng đã được cập nhật',
      });

      // Đóng dialog
      setIsAddressDialogOpen(false);
    } catch (error) {
      console.error('Lỗi khi cập nhật địa chỉ:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật địa chỉ. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingAddress(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return (
          <Badge
            variant='outline'
            className='bg-yellow-50 text-yellow-700 border-yellow-200'
          >
            Chờ xử lý
          </Badge>
        );
      case OrderStatus.SHIPPING:
        return (
          <Badge
            variant='outline'
            className='bg-blue-50 text-blue-700 border-blue-200'
          >
            Đang giao hàng
          </Badge>
        );
      case OrderStatus.COMPLETED:
        return (
          <Badge
            variant='outline'
            className='bg-green-50 text-green-700 border-green-200'
          >
            Hoàn thành
          </Badge>
        );
      case OrderStatus.CANCELLED:
        return (
          <Badge
            variant='outline'
            className='bg-red-50 text-red-700 border-red-200'
          >
            Đã hủy
          </Badge>
        );
      default:
        return <Badge variant='outline'>Không xác định</Badge>;
    }
  };

  // Hiển thị loading khi đang tải dữ liệu
  if (isLoading) {
    return (
      <div className='container py-8 flex flex-col items-center justify-center min-h-[50vh]'>
        <Loader2 className='h-8 w-8 animate-spin mb-4' />
        <p>Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  // Hiển thị thông báo nếu không tìm thấy đơn hàng
  if (!order) {
    return (
      <div className='container py-8 text-center'>
        <h1 className='text-3xl font-bold mb-4'>Không tìm thấy đơn hàng</h1>
        <p className='mb-4'>
          Đơn hàng không tồn tại hoặc bạn không có quyền truy cập.
        </p>
        <Button asChild>
          <Link href='/orders'>Quay lại danh sách đơn hàng</Link>
        </Button>
      </div>
    );
  }

  const formattedDate = order.created_at
    ? format(new Date(order.created_at), 'dd/MM/yyyy HH:mm', { locale: vi })
    : 'N/A';

  // Chuẩn bị giá trị mặc định cho form địa chỉ
  const defaultAddressValues = order.address
    ? {
        label: order.address.label || 'HOME',
        province: order.address.province || '',
        district: order.address.district || '',
        ward: order.address.ward || '',
        street: order.address.street || '',
        note: order.address.note || '',
      }
    : undefined;

  return (
    <div className='container py-8'>
      <div className='flex items-center mb-6'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => router.back()}
          className='mr-4'
        >
          <ArrowLeft className='h-4 w-4 mr-2' />
          Quay lại
        </Button>
        <h1 className='text-3xl font-bold'>Chi tiết đơn hàng #{orderId}</h1>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='md:col-span-2 space-y-6'>
          {/* Trạng thái đơn hàng */}
          <Card>
            <CardHeader>
              <CardTitle className='flex justify-between items-center'>
                <span>Trạng thái đơn hàng</span>
                {getStatusBadge(order.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrderStatusProgress status={order.status} />
            </CardContent>
          </Card>

          {/* Danh sách sản phẩm */}
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm đã đặt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {order.order_items?.map((item: OrderItemResponse) => (
                  <div key={item.id} className='flex items-center gap-4'>
                    <div className='relative h-20 w-20 shrink-0 overflow-hidden rounded-md border'>
                      <Image
                        src={item.product?.images?.[0] || '/placeholder.svg'}
                        alt={item.product?.name || 'Sản phẩm'}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <div className='flex flex-1 flex-col'>
                      <h3 className='font-medium'>
                        {item.product?.name || 'Sản phẩm không xác định'}
                      </h3>
                      <div className='flex items-center justify-between'>
                        <p className='text-sm text-muted-foreground'>
                          SL: {item.quantity}
                        </p>
                        <p className='font-medium'>
                          {(item.price || 0).toLocaleString()}đ
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Địa chỉ giao hàng */}
          <Card>
            <CardHeader>
              <CardTitle className='flex justify-between items-center'>
                <span>Địa chỉ giao hàng</span>
                {order.status === OrderStatus.PENDING && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setIsAddressDialogOpen(true)}
                  >
                    <Edit className='h-4 w-4 mr-2' />
                    Thay đổi
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-start gap-3'>
                <MapPin className='h-5 w-5 text-muted-foreground shrink-0 mt-0.5' />
                <div>
                  <p>
                    {order.address?.street}, {order.address?.ward},{' '}
                    {order.address?.district}, {order.address?.province}
                  </p>
                  {order.address?.note && (
                    <p className='text-sm text-muted-foreground mt-2'>
                      Ghi chú: {order.address.note}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Thông tin đơn hàng */}
        <div>
          <Card className='sticky top-20'>
            <CardHeader>
              <CardTitle>Thông tin đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Mã đơn hàng:</p>
                <p className='font-medium'>#{order.id}</p>
              </div>

              <div>
                <p className='text-sm text-muted-foreground'>Ngày đặt hàng:</p>
                <p>{formattedDate}</p>
              </div>

              <div>
                <p className='text-sm text-muted-foreground'>Số điện thoại:</p>
                <p>{order.phone || 'N/A'}</p>
              </div>

              <Separator />

              <div>
                <p className='text-sm text-muted-foreground'>Tạm tính:</p>
                <p>{order.original_price?.toLocaleString()}đ</p>
              </div>

              {order.discount_amount > 0 && (
                <div>
                  <p className='text-sm text-muted-foreground'>Giảm giá:</p>
                  <p className='text-green-600'>
                    -{order.discount_amount?.toLocaleString()}đ
                  </p>
                </div>
              )}

              <div>
                <p className='text-sm text-muted-foreground'>Tổng cộng:</p>
                <p className='text-xl font-bold'>
                  {order.total_price?.toLocaleString()}đ
                </p>
              </div>

              {order.status === OrderStatus.PENDING && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant='destructive' className='w-full'>
                      Hủy đơn hàng
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xác nhận hủy đơn hàng</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này
                        không thể hoàn tác.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleCancelOrder}
                        disabled={isCancelling}
                      >
                        {isCancelling ? (
                          <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Đang xử lý...
                          </>
                        ) : (
                          'Xác nhận hủy'
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              <Button variant='outline' className='w-full' asChild>
                <Link href='/orders'>Quay lại danh sách đơn hàng</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog cập nhật địa chỉ */}
      <AddressDialog
        isOpen={isAddressDialogOpen}
        onOpenChange={setIsAddressDialogOpen}
        onSubmit={handleUpdateAddress}
        title='Cập nhật địa chỉ giao hàng'
        description='Vui lòng nhập thông tin địa chỉ giao hàng mới'
        buttonText={isUpdatingAddress ? 'Đang cập nhật...' : 'Cập nhật địa chỉ'}
        defaultValues={defaultAddressValues}
      />
    </div>
  );
}
