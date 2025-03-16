'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Breadcrumb from '@/components/custom/custom-breadcrumb';
import PaginationWrapper from '@/components/custom/pagination-wrapper';
import {
  OrderStatus,
  OrderResponse,
} from '@/services/types/response/order.res';
import { getAllOrders, updateOrder } from '@/services/modules/order.service';

export default function OrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const pageSize = 10;

  // Hàm lấy danh sách đơn hàng
  const fetchOrders = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await getAllOrders({
        page,
        size: pageSize,
      });
      setOrders(response.orders || []);
      setTotalPages(Math.ceil((response.total || 0) / pageSize));
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

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, searchTerm, statusFilter]);

  // Hàm xử lý cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async (
    orderId: number,
    newStatus: OrderStatus
  ) => {
    try {
      await updateOrder({
        id: orderId,
        status: newStatus,
      });

      fetchOrders(currentPage);

      toast({
        title: 'Thành công',
        description: 'Đã cập nhật trạng thái đơn hàng',
      });
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật trạng thái đơn hàng',
        variant: 'destructive',
      });
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

  // Hiển thị loading
  if (isLoading) {
    return (
      <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
        <Breadcrumb items={[{ label: 'Quản lý đơn hàng', href: '/orders' }]} />
        <div className='flex items-center justify-center h-[400px]'>
          <Loader2 className='h-8 w-8 animate-spin' />
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
      <Breadcrumb items={[{ label: 'Quản lý đơn hàng', href: '/orders' }]} />

      <div className='flex items-center justify-between space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Quản lý đơn hàng</h2>
      </div>

      <div className='flex items-center gap-4 mb-4'>
        <div className='flex-1 relative'>
          <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Tìm kiếm theo mã đơn hàng, tên khách hàng...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-8'
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value)}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Lọc theo trạng thái' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tất cả</SelectItem>
            <SelectItem value={OrderStatus.PENDING}>Chờ xử lý</SelectItem>
            <SelectItem value={OrderStatus.SHIPPING}>Đang giao</SelectItem>
            <SelectItem value={OrderStatus.COMPLETED}>Hoàn thành</SelectItem>
            <SelectItem value={OrderStatus.CANCELLED}>Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='border rounded-lg'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn hàng</TableHead>
              <TableHead>Ngày đặt</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>
                  {format(new Date(order.created_at), 'dd/MM/yyyy HH:mm', {
                    locale: vi,
                  })}
                </TableCell>
                <TableCell>
                  <div>
                    <p className='font-medium'>{order.user?.name}</p>
                    <p className='text-sm text-muted-foreground'>
                      {order.user?.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{order.total_price?.toLocaleString()}đ</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        // Chuyển đến trang chi tiết đơn hàng
                        window.location.href = `/orders/${order.id}`;
                      }}
                    >
                      Chi tiết
                    </Button>
                    {order.status !== OrderStatus.CANCELLED && (
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          handleUpdateStatus(order.id, value as OrderStatus)
                        }
                      >
                        <SelectTrigger className='w-[140px]'>
                          <SelectValue placeholder='Cập nhật' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={OrderStatus.PENDING}>
                            Chờ xử lý
                          </SelectItem>
                          <SelectItem value={OrderStatus.SHIPPING}>
                            Đang giao
                          </SelectItem>
                          <SelectItem value={OrderStatus.COMPLETED}>
                            Hoàn thành
                          </SelectItem>
                          <SelectItem value={OrderStatus.CANCELLED}>
                            Hủy đơn
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className='text-center'>
                  Không có đơn hàng nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationWrapper
        totalPage={totalPages}
        onPageChange={setCurrentPage}
        selectedPage={currentPage}
      />
    </div>
  );
}
