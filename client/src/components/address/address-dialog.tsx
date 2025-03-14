import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { PlacePrediction } from '@/services/types/response/address_types/address.res';
import { getDistricts, getWards } from '@/services/modules/address.service';

// Schema cho form địa chỉ
const addressFormSchema = z.object({
  label: z.string({ required_error: 'Vui lòng chọn nhãn địa chỉ' }),
  province: z.string({ required_error: 'Vui lòng chọn tỉnh/thành phố' }),
  district: z.string({ required_error: 'Vui lòng chọn quận/huyện' }),
  ward: z.string({ required_error: 'Vui lòng chọn phường/xã' }),
  street: z.string().min(3, 'Vui lòng nhập chi tiết địa chỉ'),
  note: z.string().optional(),
});

export type AddressFormValues = z.infer<typeof addressFormSchema>;

interface AddressDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AddressFormValues) => void;
  provinces: { code: string; name: string }[];
  title: string;
  description: string;
  buttonText: string;
  defaultValues?: AddressFormValues;
  addressSuggestions: PlacePrediction[];
  isSearching: boolean;
  selectedPlace: PlacePrediction | null;
  onSelectPlace: (place: PlacePrediction) => void;
  triggerButton?: React.ReactNode;
}

export function AddressDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  provinces,
  title,
  description,
  buttonText,
  defaultValues = {
    label: 'HOME',
    province: '',
    district: '',
    ward: '',
    street: '',
    note: '',
  },
  addressSuggestions,
  isSearching,
  selectedPlace,
  onSelectPlace,
  triggerButton,
}: AddressDialogProps) {
  const [districts, setDistricts] = useState<{ code: string; name: string }[]>(
    []
  );
  const [wards, setWards] = useState<{ code: string; name: string }[]>([]);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues,
  });

  // Lấy giá trị của các trường form
  const provinceValue = form.watch('province');
  const districtValue = form.watch('district');

  // Reset form khi dialog đóng
  useEffect(() => {
    if (!isOpen) {
      form.reset(defaultValues);
    } else if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [isOpen, form]);

  // Lấy danh sách quận/huyện khi chọn tỉnh/thành phố
  useEffect(() => {
    if (provinceValue) {
      const fetchDistrictsData = async () => {
        try {
          const data = await getDistricts(provinceValue);
          setDistricts(data);
          // Chỉ reset district và ward nếu đang không có giá trị
          const currentDistrict = form.getValues('district');
          if (!currentDistrict) {
            form.setValue('district', '', { shouldValidate: false });
            form.setValue('ward', '', { shouldValidate: false });
          }
        } catch (error) {
          console.error('Lỗi khi lấy danh sách quận/huyện:', error);
        }
      };
      fetchDistrictsData();
    } else {
      setDistricts([]);
    }
  }, [provinceValue, form]);

  // Lấy danh sách phường/xã khi chọn quận/huyện
  useEffect(() => {
    if (districtValue) {
      const fetchWardsData = async () => {
        try {
          const data = await getWards(districtValue);
          setWards(data);
          // Chỉ reset ward nếu đang không có giá trị
          const currentWard = form.getValues('ward');
          if (!currentWard) {
            form.setValue('ward', '', { shouldValidate: false });
          }
        } catch (error) {
          console.error('Lỗi khi lấy danh sách phường/xã:', error);
        }
      };
      fetchWardsData();
    } else {
      setWards([]);
    }
  }, [districtValue, form]);

  const handleFormSubmit = (data: AddressFormValues) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className='space-y-4'
            >
              {/* Nhãn địa chỉ */}
              <FormField
                control={form.control}
                name='label'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhãn địa chỉ</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Chọn nhãn địa chỉ' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='HOME'>Nhà riêng</SelectItem>
                        <SelectItem value='OFFICE'>Văn phòng</SelectItem>
                        <SelectItem value='OTHER'>Khác</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Chọn nhãn để dễ dàng phân biệt các địa chỉ
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tỉnh/Thành phố */}
              <FormField
                control={form.control}
                name='province'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tỉnh/Thành phố</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Chọn tỉnh/thành phố' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {provinces.map((province) => (
                          <SelectItem key={province.code} value={province.code}>
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Quận/Huyện */}
              <FormField
                control={form.control}
                name='district'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quận/Huyện</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      disabled={!provinceValue || districts.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Chọn quận/huyện' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district.code} value={district.code}>
                            {district.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phường/Xã */}
              <FormField
                control={form.control}
                name='ward'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phường/Xã</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      disabled={!districtValue || wards.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Chọn phường/xã' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {wards.map((ward) => (
                          <SelectItem key={ward.code} value={ward.code}>
                            {ward.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Chi tiết địa chỉ */}
              <FormField
                control={form.control}
                name='street'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chi tiết địa chỉ</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          placeholder='Nhập số nhà, tên đường...'
                          {...field}
                          disabled={!form.watch('ward')}
                        />
                        {isSearching && (
                          <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                            <div className='animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full'></div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Nhập số nhà, tên đường, tổ, khu phố...
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Danh sách gợi ý địa chỉ */}
              {addressSuggestions.length > 0 && !selectedPlace && (
                <div className='border border-border rounded-md p-2 max-h-[200px] overflow-y-auto'>
                  <p className='text-sm text-muted-foreground mb-2'>
                    Gợi ý địa chỉ:
                  </p>
                  <div className='space-y-2'>
                    {addressSuggestions.map((place) => (
                      <div
                        key={place.place_id}
                        className='p-2 hover:bg-muted rounded-md cursor-pointer'
                        onClick={() => onSelectPlace(place)}
                      >
                        <p className='font-medium'>
                          {place.structured_formatting.main_text}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          {place.structured_formatting.secondary_text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Địa chỉ đã chọn */}
              {selectedPlace && (
                <div className='border border-border rounded-md p-3 bg-muted'>
                  <p className='text-sm text-muted-foreground mb-1'>
                    Địa chỉ đã chọn:
                  </p>
                  <p className='font-medium'>
                    {selectedPlace.structured_formatting.main_text}
                  </p>
                  <p className='text-sm'>
                    {selectedPlace.structured_formatting.secondary_text}
                  </p>
                </div>
              )}

              {/* Ghi chú */}
              <FormField
                control={form.control}
                name='note'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú (tùy chọn)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Thêm ghi chú cho địa chỉ này...'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Ví dụ: Gần ngã tư, cổng màu xanh,...
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => onOpenChange(false)}
                >
                  Hủy
                </Button>
                <Button type='submit' disabled={!selectedPlace}>
                  {buttonText}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Component nút thêm địa chỉ mới
export function AddAddressButton({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick}>
      <Plus className='mr-2 h-4 w-4' /> Thêm địa chỉ mới
    </Button>
  );
}
