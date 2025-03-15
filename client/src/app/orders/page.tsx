'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Package,
  ShoppingBag,
  Truck,
  CheckCircle,
} from 'lucide-react';
import { getAllOrders } from '@/services/modules/order.service';
import { useUserStore } from '@/store/useUserStore';
import { useToast } from '@/hooks/use-toast';
import {
  OrderStatus,
  OrderResponse,
} from '@/services/types/response/order_types/order.res';

// Component hiển thị thanh tiến trình trạng thái đơn hàng
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
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              statusIndex >= 0
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <ShoppingBag className='h-4 w-4' />
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
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              statusIndex >= 1
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <Truck className='h-4 w-4' />
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
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              statusIndex >= 2
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <CheckCircle className='h-4 w-4' />
          </div>
          <span className='text-xs mt-1'>Hoàn thành</span>
        </div>
      </div>
    </div>
  );
};

// Component hiển thị thông tin đơn hàng
const OrderCard = ({ order }) => {
  const router = useRouter();
  const formattedDate = order.created_at
    ? format(new Date(order.created_at), 'dd/MM/yyyy HH:mm', { locale: vi })
    : 'N/A';

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

  return (
    <Card className='mb-4'>
      <CardHeader className='pb-2'>
        <div className='flex justify-between items-center'>
          <div>
            <div className='text-sm text-muted-foreground'>
              Mã đơn hàng: #{order.id}
            </div>
            <div className='text-sm text-muted-foreground'>
              Ngày đặt: {formattedDate}
            </div>
          </div>
          {getStatusBadge(order.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className='mb-4'>
          <OrderStatusProgress status={order.status} />
        </div>

        <div className='space-y-4'>
          {order.order_items?.map((item) => (
            <div key={item.id} className='flex items-center gap-4'>
              <div className='relative h-16 w-16 shrink-0 overflow-hidden rounded-md border'>
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
                  <p className='font-medium'>{item.price?.toLocaleString()}đ</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator className='my-4' />

        <div className='flex justify-between items-center'>
          <div>
            <p className='text-sm text-muted-foreground'>Địa chỉ giao hàng:</p>
            <p className='text-sm'>
              {order.address?.street}, {order.address?.ward},{' '}
              {order.address?.district}, {order.address?.province}
            </p>
          </div>
          <div className='text-right'>
            <p className='text-sm text-muted-foreground'>Tổng tiền:</p>
            <p className='font-bold text-lg'>
              {order.total_price?.toLocaleString()}đ
            </p>
          </div>
        </div>

        <div className='mt-4 flex justify-end gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => router.push(`/orders/${order.id}`)}
          >
            Chi tiết
          </Button>

          {order.status === OrderStatus.PENDING && (
            <Button variant='destructive' size='sm'>
              Hủy đơn hàng
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function OrdersPage() {
  const { user } = useUserStore();
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.user_id) return;

      try {
        setIsLoading(true);
        const response = await getAllOrders({
          page: 1,
          size: 100,
          user_id: user.user_id,
        });
        setOrders(response.orders || []);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể lấy danh sách đơn hàng',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user, toast]);

  // Lọc đơn hàng theo trạng thái
  const filteredOrders =
    activeTab === 'all'
      ? orders
      : orders.filter((order) => order.status === activeTab);

  // Hiển thị loading khi đang tải dữ liệu
  if (isLoading) {
    return (
      <div className='container py-8 flex flex-col items-center justify-center min-h-[50vh]'>
        <Loader2 className='h-8 w-8 animate-spin mb-4' />
        <p>Đang tải danh sách đơn hàng...</p>
      </div>
    );
  }

  // Hiển thị thông báo nếu không có đơn hàng
  if (!orders.length) {
    return (
      <div className='container py-8 text-center'>
        <h1 className='text-3xl font-bold mb-4'>Đơn hàng của tôi</h1>
        <div className='p-8 border rounded-lg'>
          <Package className='h-12 w-12 mx-auto mb-4 text-muted-foreground' />
          <p className='mb-4'>Bạn chưa có đơn hàng nào.</p>
          <Button asChild>
            <Link href='/category/all'>Mua sắm ngay</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='container py-8'>
      <h1 className='text-3xl font-bold mb-6'>Đơn hàng của tôi</h1>

      <Tabs
        defaultValue='all'
        value={activeTab}
        onValueChange={setActiveTab}
        className='mb-6'
      >
        <TabsList className='grid grid-cols-5 w-full max-w-md'>
          <TabsTrigger value='all'>Tất cả</TabsTrigger>
          <TabsTrigger value={OrderStatus.PENDING}>Chờ xử lý</TabsTrigger>
          <TabsTrigger value={OrderStatus.SHIPPING}>Đang giao</TabsTrigger>
          <TabsTrigger value={OrderStatus.COMPLETED}>Hoàn thành</TabsTrigger>
          <TabsTrigger value={OrderStatus.CANCELLED}>Đã hủy</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className='space-y-4'>
        {filteredOrders.length === 0 ? (
          <div className='text-center py-8'>
            <p className='text-muted-foreground'>
              Không có đơn hàng nào trong trạng thái này
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </div>
    </div>
  );
}
