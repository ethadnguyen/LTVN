'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, ChevronRight, Loader2, Plus } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useToast } from '@/hooks/use-toast';
import { AddressDialog } from '@/components/address/address-dialog';
import {
  getProvinces,
  getAllAddresses,
} from '@/services/modules/address.service';
import { createOrder } from '@/services/modules/order.service';
import { createPayment } from '@/services/modules/payment.service';
import { PlacePrediction } from '@/services/types/response/address_types/address.res';
import { AddressResponse } from '@/services/types/response/address_types/address.res';
import { PaymentMethod } from '@/services/types/request/payment_types/payment.req';
import { useUserStore } from '@/store/useUserStore';
import { Input } from '@/components/ui/input';

export default function CheckoutPage() {
  const { toast } = useToast();
  const {
    cart,
    isLoading: isCartLoading,
    fetchCart,
    clearCart,
  } = useCartStore();

  const { user } = useUserStore();

  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('CASH');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [note, setNote] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [orderId, setOrderId] = useState<string>('');
  const [orderDate, setOrderDate] = useState<string>('');

  // Địa chỉ
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [provinces, setProvinces] = useState<{ code: string; name: string }[]>(
    []
  );
  const [addressSuggestions] = useState<PlacePrediction[]>([]);
  const [isSearching] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlacePrediction | null>(
    null
  );

  // Tính toán giá tiền
  const subtotal = cart?.total || 0;
  const shippingCost = shippingMethod === 'standard' ? 50000 : 100000;
  const discount = 0; // Giả sử chưa có giảm giá
  const total = Number(subtotal) + Number(shippingCost) - Number(discount);

  // Lấy danh sách địa chỉ của người dùng
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setIsAddressLoading(true);
        const data = await getAllAddresses({
          page: 1,
          size: 100,
          user_id: user?.user_id,
        });
        setAddresses(data.addresses || []);
        if (data.addresses && data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0].id.toString());
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách địa chỉ:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể lấy danh sách địa chỉ',
          variant: 'destructive',
        });
      } finally {
        setIsAddressLoading(false);
      }
    };

    const fetchProvinceData = async () => {
      try {
        const data = await getProvinces();
        setProvinces(data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách tỉnh/thành phố:', error);
      }
    };

    fetchAddresses();
    fetchProvinceData();
  }, [toast]);

  // Lấy thông tin giỏ hàng
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Xử lý khi chọn địa điểm từ gợi ý
  const handleSelectPlace = (place: PlacePrediction) => {
    setSelectedPlace(place);
  };

  // Xử lý khi thêm địa chỉ mới
  const handleAddAddress = () => {
    // Đóng dialog
    setIsAddressDialogOpen(false);

    // Làm mới danh sách địa chỉ
    getAllAddresses({
      page: 1,
      size: 100,
      user_id: user?.user_id,
    }).then((data) => {
      setAddresses(data.addresses || []);
      if (data.addresses && data.addresses.length > 0) {
        // Chọn địa chỉ mới thêm
        const newAddress = data.addresses[data.addresses.length - 1];
        setSelectedAddress(newAddress.id.toString());
      }
    });
  };

  // Xử lý đặt hàng
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn địa chỉ giao hàng',
        variant: 'destructive',
      });
      return;
    }

    if (!phoneNumber) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập số điện thoại',
        variant: 'destructive',
      });
      return;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      toast({
        title: 'Lỗi',
        description: 'Giỏ hàng trống',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsProcessing(true);

      // Tạo đơn hàng
      const orderItems = cart.items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));

      const orderData = {
        order_items: orderItems,
        total_price: total,
        phone: phoneNumber,
        address_id: parseInt(selectedAddress),
        amount: total,
        user_id: Number(user?.user_id),
      };

      const orderResponse = await createOrder(orderData);

      // Nếu thanh toán bằng VNPAY, tạo thanh toán
      if (paymentMethod === 'VNPAY') {
        const paymentData = {
          order_id: orderResponse.id,
          payment_method: PaymentMethod.VNPAY,
          amount: total,
        };

        const paymentResponse = await createPayment(paymentData);

        // Chuyển hướng đến trang thanh toán VNPAY
        window.location.href = paymentResponse.paymentUrl;
        return;
      }

      // Nếu thanh toán COD, hiển thị trang thành công
      setOrderId(orderResponse.id.toString());
      setOrderDate(new Date().toLocaleDateString());
      setCurrentStep(2);

      // Xóa giỏ hàng
      await clearCart();
    } catch (error) {
      console.error('Lỗi khi đặt hàng:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể đặt hàng. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Hiển thị loading khi đang tải giỏ hàng
  if (isCartLoading && !cart) {
    return (
      <div className='container py-8 flex flex-col items-center justify-center min-h-[50vh]'>
        <Loader2 className='h-8 w-8 animate-spin mb-4' />
        <p>Đang tải thông tin thanh toán...</p>
      </div>
    );
  }

  // Kiểm tra giỏ hàng trống
  if (!cart?.items?.length) {
    return (
      <div className='container py-8 text-center'>
        <h1 className='text-3xl font-bold mb-4'>Thanh toán</h1>
        <div className='p-8 border rounded-lg'>
          <p className='mb-4'>
            Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm vào giỏ hàng
            trước khi thanh toán.
          </p>
          <Button asChild>
            <Link href='/category/all'>Tiếp tục mua sắm</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='container py-8'>
      {currentStep === 1 ? (
        <>
          <div className='flex items-center mb-8'>
            <h1 className='text-3xl font-bold'>Thanh toán</h1>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <div className='lg:col-span-2 space-y-8'>
              {/* Địa chỉ giao hàng */}
              <Card>
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-xl font-bold'>Địa chỉ giao hàng</h2>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setIsAddressDialogOpen(true)}
                    >
                      <Plus className='mr-2 h-4 w-4' />
                      Thêm địa chỉ mới
                    </Button>
                  </div>

                  {isAddressLoading ? (
                    <div className='flex justify-center py-4'>
                      <Loader2 className='h-6 w-6 animate-spin' />
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className='text-center py-4 border rounded-lg'>
                      <p className='text-muted-foreground mb-2'>
                        Bạn chưa có địa chỉ nào
                      </p>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => setIsAddressDialogOpen(true)}
                      >
                        <Plus className='mr-2 h-4 w-4' />
                        Thêm địa chỉ mới
                      </Button>
                    </div>
                  ) : (
                    <RadioGroup
                      value={selectedAddress}
                      onValueChange={setSelectedAddress}
                      className='space-y-4'
                    >
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className='flex items-start space-x-3 border rounded-lg p-4'
                        >
                          <RadioGroupItem
                            value={address.id.toString()}
                            id={`address-${address.id}`}
                            className='mt-1'
                          />
                          <div className='flex-1'>
                            <div className='flex items-center gap-2'>
                              <Label
                                htmlFor={`address-${address.id}`}
                                className='font-medium cursor-pointer'
                              >
                                {address.label === 'HOME'
                                  ? 'Nhà riêng'
                                  : address.label === 'OFFICE'
                                  ? 'Văn phòng'
                                  : 'Khác'}
                              </Label>
                            </div>
                            <p className='text-sm'>
                              {address.street}, {address.ward},{' '}
                              {address.district}, {address.province}
                            </p>
                            {address.note && (
                              <p className='text-sm text-muted-foreground mt-1'>
                                Ghi chú: {address.note}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </CardContent>
              </Card>

              {/* Số điện thoại */}
              <Card>
                <CardContent className='p-6'>
                  <h2 className='text-xl font-bold mb-4'>
                    Số điện thoại liên hệ
                  </h2>
                  <div className='space-y-2'>
                    <Label htmlFor='phone'>Số điện thoại</Label>
                    <Input
                      id='phone'
                      type='tel'
                      placeholder='Nhập số điện thoại nhận hàng'
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className='w-full'
                    />
                    <p className='text-sm text-muted-foreground'>
                      Số điện thoại này sẽ được sử dụng để liên hệ khi giao hàng
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Phương thức vận chuyển */}
              <Card>
                <CardContent className='p-6'>
                  <h2 className='text-xl font-bold mb-4'>
                    Phương thức vận chuyển
                  </h2>

                  <RadioGroup
                    value={shippingMethod}
                    onValueChange={setShippingMethod}
                    className='space-y-4'
                  >
                    <div className='flex items-start space-x-3 border rounded-lg p-4'>
                      <RadioGroupItem
                        value='standard'
                        id='standard'
                        className='mt-1'
                      />
                      <div className='flex-1'>
                        <div className='flex items-center justify-between'>
                          <Label
                            htmlFor='standard'
                            className='font-medium cursor-pointer'
                          >
                            Giao hàng tiêu chuẩn
                          </Label>
                          <span className='font-medium'>50.000đ</span>
                        </div>
                        <p className='text-sm text-muted-foreground'>
                          Nhận hàng trong 3-5 ngày
                        </p>
                      </div>
                    </div>

                    <div className='flex items-start space-x-3 border rounded-lg p-4'>
                      <RadioGroupItem
                        value='express'
                        id='express'
                        className='mt-1'
                      />
                      <div className='flex-1'>
                        <div className='flex items-center justify-between'>
                          <Label
                            htmlFor='express'
                            className='font-medium cursor-pointer'
                          >
                            Giao hàng nhanh
                          </Label>
                          <span className='font-medium'>100.000đ</span>
                        </div>
                        <p className='text-sm text-muted-foreground'>
                          Nhận hàng trong 1-2 ngày
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Phương thức thanh toán */}
              <Card>
                <CardContent className='p-6'>
                  <h2 className='text-xl font-bold mb-4'>
                    Phương thức thanh toán
                  </h2>

                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className='space-y-4'
                  >
                    <div className='flex items-start space-x-3 border rounded-lg p-4'>
                      <RadioGroupItem value='CASH' id='CASH' className='mt-1' />
                      <div className='flex-1'>
                        <Label
                          htmlFor='CASH'
                          className='font-medium cursor-pointer'
                        >
                          Thanh toán khi nhận hàng (COD)
                        </Label>
                        <p className='text-sm text-muted-foreground'>
                          Thanh toán bằng tiền mặt khi nhận hàng
                        </p>
                      </div>
                    </div>

                    <div className='flex items-start space-x-3 border rounded-lg p-4'>
                      <RadioGroupItem
                        value='VNPAY'
                        id='VNPAY'
                        className='mt-1'
                      />
                      <div className='flex-1'>
                        <Label
                          htmlFor='VNPAY'
                          className='font-medium cursor-pointer'
                        >
                          Thanh toán qua VNPAY
                        </Label>
                        <p className='text-sm text-muted-foreground'>
                          Thanh toán an toàn qua cổng thanh toán VNPAY
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Ghi chú */}
              <Card>
                <CardContent className='p-6'>
                  <h2 className='text-xl font-bold mb-4'>Ghi chú đơn hàng</h2>
                  <Textarea
                    placeholder='Nhập ghi chú cho đơn hàng (không bắt buộc)'
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className='min-h-[100px]'
                  />
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className='sticky top-20'>
                <CardContent className='p-6'>
                  <h2 className='text-xl font-bold mb-4'>Tóm tắt đơn hàng</h2>

                  <div className='space-y-4 mb-4'>
                    {cart.items.map((item) => (
                      <div key={item.product_id} className='flex gap-4'>
                        <div className='relative h-16 w-16 shrink-0 overflow-hidden rounded-md border'>
                          <Image
                            src={
                              item.product?.images?.[0] || '/placeholder.svg'
                            }
                            alt={item.product?.name || 'Sản phẩm'}
                            fill
                            className='object-cover'
                          />
                        </div>
                        <div className='flex flex-1 flex-col gap-1'>
                          <h3 className='line-clamp-1 text-sm font-medium'>
                            {item.product?.name || 'Sản phẩm không xác định'}
                          </h3>
                          <div className='flex items-center justify-between text-sm'>
                            <p className='text-muted-foreground'>
                              SL: {item.quantity}
                            </p>
                            <p>{item.price.toLocaleString()}đ</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className='my-4' />

                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Tạm tính</span>
                      <span>{subtotal.toLocaleString()}đ</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>
                        Phí vận chuyển
                      </span>
                      <span>{shippingCost.toLocaleString()}đ</span>
                    </div>
                    {discount > 0 && (
                      <div className='flex justify-between text-green-600'>
                        <span>Giảm giá</span>
                        <span>-{discount.toLocaleString()}đ</span>
                      </div>
                    )}
                  </div>

                  <Separator className='my-4' />

                  <div className='flex justify-between font-bold text-lg'>
                    <span>Tổng cộng</span>
                    <span>{total.toLocaleString()}đ</span>
                  </div>

                  <Button
                    className='w-full mt-6'
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || !selectedAddress}
                  >
                    {isProcessing ? 'Đang xử lý...' : 'Đặt hàng'}
                  </Button>

                  <p className='text-sm text-muted-foreground text-center mt-4'>
                    Bằng cách đặt hàng, bạn đồng ý với{' '}
                    <Link
                      href='/terms'
                      className='text-primary hover:underline'
                    >
                      Điều khoản dịch vụ
                    </Link>{' '}
                    của chúng tôi
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <div className='max-w-md mx-auto text-center py-12'>
          <div className='rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-6'>
            <CheckCircle2 className='h-8 w-8 text-green-600' />
          </div>
          <h1 className='text-2xl font-bold mb-2'>Đặt hàng thành công!</h1>
          <p className='text-muted-foreground mb-6'>
            Cảm ơn bạn đã đặt hàng. Chúng tôi đã gửi email xác nhận đơn hàng đến
            địa chỉ email của bạn.
          </p>
          <div className='bg-muted p-4 rounded-lg mb-6'>
            <p className='font-medium'>Mã đơn hàng: #{orderId}</p>
            <p className='text-sm text-muted-foreground'>
              Ngày đặt hàng: {orderDate}
            </p>
          </div>
          <div className='flex flex-col gap-4'>
            <Button asChild>
              <Link href={`/orders/${orderId}`}>
                Xem chi tiết đơn hàng
                <ChevronRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
            <Button variant='outline' asChild>
              <Link href='/'>Tiếp tục mua sắm</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Dialog thêm địa chỉ mới */}
      <AddressDialog
        isOpen={isAddressDialogOpen}
        onOpenChange={setIsAddressDialogOpen}
        onSubmit={handleAddAddress}
        provinces={provinces}
        title='Thêm địa chỉ mới'
        description='Nhập thông tin địa chỉ giao hàng của bạn'
        buttonText='Thêm địa chỉ'
        addressSuggestions={addressSuggestions}
        isSearching={isSearching}
        selectedPlace={selectedPlace}
        onSelectPlace={handleSelectPlace}
      />
    </div>
  );
}
