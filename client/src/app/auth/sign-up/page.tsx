'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import GoogleIcon from '@/assets/icons/google.svg';
import FacebookIcon from '@/assets/icons/facebook.svg';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema } from './sign-up.schema';
import type { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: '',
    },
  });

  const handleSubmit = async (values: SignUpFormValues) => {
    if (values.password !== values.confirmPassword) {
      toast({
        title: 'Lỗi',
        description: 'Mật khẩu không khớp!',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Giả lập đăng ký
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: 'Đăng ký thành công',
        description: 'Tài khoản của bạn đã được tạo thành công.',
      });

      router.push('/auth/sign-in');
    } catch (error: unknown) {
      toast({
        title: 'Đăng ký thất bại',
        description: 'Có lỗi xảy ra khi đăng ký tài khoản.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container max-w-md mx-auto py-12'>
      <div className='space-y-6'>
        <div className='space-y-2 text-center'>
          <h1 className='text-3xl font-bold'>Đăng ký tài khoản</h1>
          <p className='text-muted-foreground'>
            Tạo tài khoản để mua sắm dễ dàng hơn
          </p>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Họ và tên</Label>
            <div className='relative'>
              <User className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                id='name'
                type='text'
                placeholder='Nguyễn Văn A'
                className='pl-10'
                {...form.register('name')}
              />
            </div>
            {form.formState.errors.name && (
              <p className='text-sm text-destructive'>
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <div className='relative'>
              <Mail className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                id='email'
                type='email'
                placeholder='name@example.com'
                className='pl-10'
                {...form.register('email')}
              />
            </div>
            {form.formState.errors.email && (
              <p className='text-sm text-destructive'>
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='phone'>Số điện thoại</Label>
            <div className='relative'>
              <Phone className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                id='phone'
                type='tel'
                placeholder='0123456789'
                className='pl-10'
                {...form.register('phone')}
              />
            </div>
            {form.formState.errors.phone && (
              <p className='text-sm text-destructive'>
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>Mật khẩu</Label>
            <div className='relative'>
              <Lock className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                className='pl-10 pr-10'
                placeholder='••••••••'
                {...form.register('password')}
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='absolute right-0 top-0 h-10 w-10'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className='h-4 w-4 text-muted-foreground' />
                ) : (
                  <Eye className='h-4 w-4 text-muted-foreground' />
                )}
                <span className='sr-only'>
                  {showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                </span>
              </Button>
            </div>
            {form.formState.errors.password && (
              <p className='text-sm text-destructive'>
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='confirmPassword'>Xác nhận mật khẩu</Label>
            <div className='relative'>
              <Lock className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                id='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                className='pl-10 pr-10'
                placeholder='••••••••'
                {...form.register('confirmPassword')}
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='absolute right-0 top-0 h-10 w-10'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className='h-4 w-4 text-muted-foreground' />
                ) : (
                  <Eye className='h-4 w-4 text-muted-foreground' />
                )}
                <span className='sr-only'>
                  {showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                </span>
              </Button>
            </div>
            {form.formState.errors.confirmPassword && (
              <p className='text-sm text-destructive'>
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className='flex items-center space-x-2'>
            <Checkbox
              id='terms'
              onCheckedChange={() => {
                // Không cần lưu trữ trong form vì không có trong schema
              }}
              required
            />
            <Label htmlFor='terms' className='text-sm font-normal'>
              Tôi đồng ý với{' '}
              <Link href='/terms' className='text-primary hover:underline'>
                Điều khoản dịch vụ
              </Link>{' '}
              và{' '}
              <Link href='/privacy' className='text-primary hover:underline'>
                Chính sách bảo mật
              </Link>
            </Label>
          </div>

          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
        </form>

        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <Separator className='w-full' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background px-2 text-muted-foreground'>
              Hoặc đăng ký với
            </span>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <Button variant='outline' className='w-full'>
            <Image
              src={GoogleIcon}
              alt='Google'
              width={20}
              height={20}
              className='mr-2'
            />
            Google
          </Button>
          <Button variant='outline' className='w-full'>
            <Image
              src={FacebookIcon}
              alt='Facebook'
              width={20}
              height={20}
              className='mr-2'
            />
            Facebook
          </Button>
        </div>

        <div className='text-center text-sm'>
          Đã có tài khoản?{' '}
          <Link href='/auth/sign-in' className='text-primary hover:underline'>
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
