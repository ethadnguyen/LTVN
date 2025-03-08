'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { AddressCombobox } from '../../components/custom/address-combobox';

const formSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().regex(/^(0|\+84)[0-9]{9}$/, 'Số điện thoại không hợp lệ'),
  province: z.string().min(1, 'Vui lòng chọn tỉnh/thành phố'),
  district: z.string().min(1, 'Vui lòng chọn quận/huyện'),
  ward: z.string().min(1, 'Vui lòng chọn phường/xã'),
  streetAddress: z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
});

interface ShippingFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
}

// Mock data - Replace with actual API calls
const mockProvinces = [
  { code: '01', name: 'Thành phố Hà Nội' },
  { code: '79', name: 'Thành phố Hồ Chí Minh' },
];

const mockDistricts = {
  '01': [
    { code: '001', name: 'Quận Ba Đình' },
    { code: '002', name: 'Quận Hoàn Kiếm' },
  ],
  '79': [
    { code: '760', name: 'Quận 1' },
    { code: '761', name: 'Quận 12' },
  ],
};

const mockWards = {
  '001': [
    { code: '00001', name: 'Phường Phúc Xá' },
    { code: '00004', name: 'Phường Trúc Bạch' },
  ],
  '760': [
    { code: '26734', name: 'Phường Bến Nghé' },
    { code: '26737', name: 'Phường Bến Thành' },
  ],
};

export function ShippingForm({ onSubmit }: ShippingFormProps) {
  const [loading, setLoading] = useState(false);
  const [districts, setDistricts] = useState<{ code: string; name: string }[]>(
    []
  );
  const [wards, setWards] = useState<{ code: string; name: string }[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      province: '',
      district: '',
      ward: '',
    },
  });

  const watchProvince = form.watch('province');
  const watchDistrict = form.watch('district');

  // Update districts when province changes
  useEffect(() => {
    if (watchProvince) {
      // Simulate API call
      setLoading(true);
      setTimeout(() => {
        setDistricts(
          mockDistricts[watchProvince as keyof typeof mockDistricts] || []
        );
        form.setValue('district', '');
        form.setValue('ward', '');
        setLoading(false);
      }, 500);
    } else {
      setDistricts([]);
    }
  }, [watchProvince, form]);

  // Update wards when district changes
  useEffect(() => {
    if (watchDistrict) {
      // Simulate API call
      setLoading(true);
      setTimeout(() => {
        setWards(mockWards[watchDistrict as keyof typeof mockWards] || []);
        form.setValue('ward', '');
        setLoading(false);
      }, 500);
    } else {
      setWards([]);
    }
  }, [watchDistrict, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid gap-4 sm:grid-cols-2'>
          <FormField
            control={form.control}
            name='fullName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên</FormLabel>
                <FormControl>
                  <Input placeholder='Nguyễn Văn A' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input placeholder='0912345678' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='sm:col-span-2'>
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
            name='province'
            render={({ field }) => (
              <FormItem className='sm:col-span-2'>
                <FormLabel>Tỉnh/Thành phố</FormLabel>
                <FormControl>
                  <AddressCombobox
                    value={field.value}
                    onValueChange={field.onChange}
                    items={mockProvinces}
                    placeholder='Chọn tỉnh/thành phố'
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='district'
            render={({ field }) => (
              <FormItem className='sm:col-span-2'>
                <FormLabel>Quận/Huyện</FormLabel>
                <FormControl>
                  <AddressCombobox
                    value={field.value}
                    onValueChange={field.onChange}
                    items={districts}
                    placeholder='Chọn quận/huyện'
                    disabled={loading || !watchProvince}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='ward'
            render={({ field }) => (
              <FormItem className='sm:col-span-2'>
                <FormLabel>Phường/Xã</FormLabel>
                <FormControl>
                  <AddressCombobox
                    value={field.value}
                    onValueChange={field.onChange}
                    items={wards}
                    placeholder='Chọn phường/xã'
                    disabled={loading || !watchDistrict}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='streetAddress'
            render={({ field }) => (
              <FormItem className='sm:col-span-2'>
                <FormLabel>Địa chỉ chi tiết</FormLabel>
                <FormControl>
                  <Input placeholder='Số nhà, tên đường...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type='submit' className='w-full'>
          Tiếp tục
        </Button>
      </form>
    </Form>
  );
}
