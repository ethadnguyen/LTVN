'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/store/useUserStore';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User,
  MapPin,
  ShoppingBag,
  CreditCard,
  Heart,
  Settings,
  LogOut,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react';

export default function ProfilePage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, checkAuth, logout } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) {
        router.push('/auth/sign-in');
      }
      setLoading(false);
    };

    verifyAuth();
  }, [checkAuth, router]);

  const handleLogout = () => {
    logout();
    toast({
      title: 'Đăng xuất thành công',
      description: 'Bạn đã đăng xuất khỏi tài khoản',
    });
    router.push('/');
  };

  // Lấy chữ cái đầu của tên người dùng cho avatar
  const getInitials = (name: string | undefined) => {
    if (!name) return 'U'; // Trả về 'U' (User) nếu không có tên

    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Format ngày tháng
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '--/--/----'; // Trả về định dạng mặc định nếu không có ngày

    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(date);
    } catch (error) {
      console.error('Lỗi khi format ngày tháng:', error);
      return '--/--/----';
    }
  };

  if (loading) {
    return (
      <div className='container py-10'>
        <div className='flex justify-center items-center min-h-[400px]'>
          <div className='animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full'></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='container py-10'>
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-10'>
            <User className='h-12 w-12 text-gray-400 mb-4' />
            <p className='text-xl font-medium mb-2'>Bạn chưa đăng nhập</p>
            <p className='text-gray-500 mb-4 text-center'>
              Vui lòng đăng nhập để xem thông tin tài khoản
            </p>
            <Button onClick={() => router.push('/auth/sign-in')}>
              Đăng nhập
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='container py-10'>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        {/* Sidebar */}
        <div className='md:col-span-1'>
          <Card>
            <CardHeader className='pb-3'>
              <div className='flex flex-col items-center'>
                <Avatar className='h-24 w-24 mb-4'>
                  <AvatarImage src='' alt={user.user_name || 'User'} />
                  <AvatarFallback className='text-lg'>
                    {getInitials(user.user_name)}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className='text-xl text-center'>
                  {user.user_name || 'Người dùng'}
                </CardTitle>
                <CardDescription className='text-center'>
                  {user.email || 'Không có email'}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <nav className='space-y-2'>
                <Button
                  variant='ghost'
                  className='w-full justify-start'
                  asChild
                >
                  <Link href='/profile'>
                    <User className='mr-2 h-4 w-4' />
                    Thông tin cá nhân
                  </Link>
                </Button>
                <Button
                  variant='ghost'
                  className='w-full justify-start'
                  asChild
                >
                  <Link href='/profile/address'>
                    <MapPin className='mr-2 h-4 w-4' />
                    Địa chỉ của tôi
                  </Link>
                </Button>
                <Button
                  variant='ghost'
                  className='w-full justify-start'
                  asChild
                >
                  <Link href='/orders'>
                    <ShoppingBag className='mr-2 h-4 w-4' />
                    Đơn hàng của tôi
                  </Link>
                </Button>
                <Button
                  variant='ghost'
                  className='w-full justify-start'
                  asChild
                >
                  <Link href='/profile/wishlist'>
                    <Heart className='mr-2 h-4 w-4' />
                    Sản phẩm yêu thích
                  </Link>
                </Button>
                <Button
                  variant='ghost'
                  className='w-full justify-start'
                  asChild
                >
                  <Link href='/profile/payment'>
                    <CreditCard className='mr-2 h-4 w-4' />
                    Phương thức thanh toán
                  </Link>
                </Button>
                <Button
                  variant='ghost'
                  className='w-full justify-start'
                  asChild
                >
                  <Link href='/profile/settings'>
                    <Settings className='mr-2 h-4 w-4' />
                    Cài đặt tài khoản
                  </Link>
                </Button>
              </nav>
            </CardContent>
            <CardFooter>
              <Button
                variant='destructive'
                className='w-full'
                onClick={handleLogout}
              >
                <LogOut className='mr-2 h-4 w-4' />
                Đăng xuất
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Main Content */}
        <div className='md:col-span-3'>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>
                Xem và quản lý thông tin cá nhân của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue='info' className='w-full'>
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger value='info'>Thông tin cơ bản</TabsTrigger>
                  <TabsTrigger value='security'>Bảo mật</TabsTrigger>
                </TabsList>
                <TabsContent value='info' className='space-y-4 pt-4'>
                  <div className='space-y-4'>
                    <div className='flex flex-col space-y-1.5'>
                      <h3 className='text-sm font-medium text-gray-500'>
                        Tên người dùng
                      </h3>
                      <div className='flex items-center'>
                        <User className='h-4 w-4 mr-2 text-gray-500' />
                        <p className='text-base font-medium'>
                          {user.user_name || 'Chưa cập nhật'}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className='flex flex-col space-y-1.5'>
                      <h3 className='text-sm font-medium text-gray-500'>
                        Email
                      </h3>
                      <div className='flex items-center'>
                        <Mail className='h-4 w-4 mr-2 text-gray-500' />
                        <p className='text-base'>
                          {user.email || 'Chưa cập nhật'}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className='flex flex-col space-y-1.5'>
                      <h3 className='text-sm font-medium text-gray-500'>
                        Số điện thoại
                      </h3>
                      <div className='flex items-center'>
                        <Phone className='h-4 w-4 mr-2 text-gray-500' />
                        <p className='text-base'>
                          {user.phone || 'Chưa cập nhật'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='pt-4'>
                    <Button>Cập nhật thông tin</Button>
                  </div>
                </TabsContent>
                <TabsContent value='security' className='space-y-4 pt-4'>
                  <div className='space-y-4'>
                    <div className='flex flex-col space-y-1.5'>
                      <h3 className='text-sm font-medium text-gray-500'>
                        Mật khẩu
                      </h3>
                      <p className='text-base'>••••••••</p>
                    </div>
                    <div className='pt-2'>
                      <Button>Đổi mật khẩu</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-lg'>Địa chỉ của tôi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-gray-500 mb-4'>
                  Quản lý địa chỉ giao hàng và thanh toán của bạn
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href='/profile/address'>
                    <MapPin className='mr-2 h-4 w-4' />
                    Quản lý địa chỉ
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-lg'>Đơn hàng gần đây</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-gray-500 mb-4'>
                  Xem và theo dõi tình trạng đơn hàng của bạn
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href='/orders'>
                    <ShoppingBag className='mr-2 h-4 w-4' />
                    Xem đơn hàng
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
