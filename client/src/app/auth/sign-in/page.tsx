'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import { signInSchema } from './sign-in.schema';
import { useToast } from '@/hooks/use-toast';
import type { z } from 'zod';
import { useUserStore } from '@/store/useUserStore';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { login, loading, error } = useUserStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useAuth(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi đăng nhập',
        description: error,
      });
    }
  }, [error, toast]);

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    try {
      await login(values);
      // router.push('/');
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
    }
  }

  async function loginWithGoogle() {
    // Implement Google login logic here
    toast({
      title: 'Chưa hỗ trợ',
      description: 'Tính năng đăng nhập bằng Google sẽ sớm được cập nhật',
    });
  }

  return (
    <div className='container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
        <div className='absolute inset-0 bg-zinc-900' />
        <div className='relative z-20 flex items-center text-lg font-medium'>
          <Icons.logo className='mr-2 h-6 w-6' />
          Logo
        </div>
        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>
              &ldquo;Đây là một cửa hàng tuyệt vời để mua sắm các linh kiện máy
              tính.&rdquo;
            </p>
            <footer className='text-sm'>Khách hàng</footer>
          </blockquote>
        </div>
      </div>
      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Đăng nhập vào tài khoản
            </h1>
            <p className='text-sm text-muted-foreground'>
              Nhập email và mật khẩu của bạn để đăng nhập
            </p>
          </div>

          <div className='grid gap-6'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder='example@gmail.com' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='••••••'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className='w-full' type='submit' disabled={loading}>
                  {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                  Đăng nhập
                </Button>
              </form>
            </Form>

            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  Hoặc tiếp tục với
                </span>
              </div>
            </div>

            <Button variant='outline' type='button' onClick={loginWithGoogle}>
              <Icons.google className='mr-2 h-4 w-4' />
              Google
            </Button>
          </div>

          <p className='px-8 text-center text-sm text-muted-foreground'>
            Chưa có tài khoản?{' '}
            <Link
              href='/auth/sign-up'
              className='underline underline-offset-4 hover:text-primary'
            >
              Đăng ký
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
