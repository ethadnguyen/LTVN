'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
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
import { signInSchema } from './sign-in.schema';
import type { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/store/useUserStore';

type SignInFormValues = z.infer<typeof signInSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useUserStore();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = async (values: SignInFormValues) => {
    setIsLoading(true);

    try {
      // Thực hiện đăng nhập thông qua useUserStore
      await login(values.email, values.password);

      toast({
        title: 'Đăng nhập thành công',
        description: 'Chào mừng bạn quay trở lại!',
      });

      router.push('/');
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      toast({
        title: 'Đăng nhập thất bại',
        description: 'Email hoặc mật khẩu không chính xác.',
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
          <h1 className='text-3xl font-bold'>Đăng nhập</h1>
          <p className='text-muted-foreground'>Đăng nhập để tiếp tục mua sắm</p>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
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
            <div className='flex items-center justify-between'>
              <Label htmlFor='password'>Mật khẩu</Label>
              <Link
                href='/forgot-password'
                className='text-sm text-primary hover:underline'
              >
                Quên mật khẩu?
              </Link>
            </div>
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

          <div className='flex items-center space-x-2'>
            <Checkbox
              id='remember'
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <Label htmlFor='remember' className='text-sm font-normal'>
              Ghi nhớ đăng nhập
            </Label>
          </div>

          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>

        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <Separator className='w-full' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background px-2 text-muted-foreground'>
              Hoặc tiếp tục với
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
          Chưa có tài khoản?{' '}
          <Link href='/auth/sign-up' className='text-primary hover:underline'>
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
