'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { PromotionRes } from '@/services/types/response/promotion-res';
import {
  createPromotion,
  updatePromotion,
} from '@/services/modules/promotion.service';
import { fetchAllProducts } from '@/services/modules/product.service';
import { fetchAllCategories } from '@/services/modules/categories.service';
import { ProductRes } from '@/services/types/response/product-res';
import { CategoryRes } from '@/services/types/response/category-res';
import { promotionSchema } from './promotion.schema';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

type FormValues = z.infer<typeof promotionSchema>;

interface PromotionDialogProps {
  open: boolean;
  onClose: () => void;
  promotion?: PromotionRes | null;
  isUpdate?: boolean;
  onRefresh?: () => void;
}

export default function PromotionDialog({
  open,
  onClose,
  promotion,
  isUpdate = false,
  onRefresh,
}: PromotionDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductRes[]>([]);
  const [categories, setCategories] = useState<CategoryRes[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'categories' | 'products'>(
    'categories'
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      name: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 0,
      start_date: new Date(),
      end_date: new Date(new Date().setDate(new Date().getDate() + 7)),
      is_active: true,
      usage_limit: null,
      minimum_order_amount: null,
      maximum_discount_amount: null,
      product_ids: [],
      category_ids: [],
    },
  });

  useEffect(() => {
    if (open) {
      fetchProducts();
      fetchCategories();
    }
  }, [open]);

  useEffect(() => {
    if (promotion && open) {
      form.reset({
        name: promotion.name,
        description: promotion.description,
        discount_type: promotion.discount_type,
        discount_value: promotion.discount_value,
        start_date: new Date(promotion.start_date),
        end_date: new Date(promotion.end_date),
        is_active: promotion.is_active,
        usage_limit: promotion.usage_limit,
        minimum_order_amount: promotion.minimum_order_amount,
        maximum_discount_amount: promotion.maximum_discount_amount,
        product_ids: promotion.products?.map((p) => p.id) || [],
        category_ids: promotion.categories?.map((c) => c.id) || [],
      });
    } else if (open) {
      form.reset({
        name: '',
        description: '',
        discount_type: 'percentage',
        discount_value: 0,
        start_date: new Date(),
        end_date: new Date(new Date().setDate(new Date().getDate() + 7)),
        is_active: true,
        usage_limit: null,
        minimum_order_amount: null,
        maximum_discount_amount: null,
        product_ids: [],
        category_ids: [],
      });
    }
  }, [promotion, open, form]);

  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const result = await fetchAllProducts({
        size: 1000,
        is_active: true,
      });

      if (result?.data?.products && Array.isArray(result.data.products)) {
        setProducts(result.data.products);
        console.log('Products fetched successfully:', result.data.products);
      } else {
        setProducts([]);
        console.error('Invalid products data:', result);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      toast({
        title: 'Thất bại',
        description: 'Không thể tải danh sách sản phẩm',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const result = await fetchAllCategories();

      if (result?.data?.categories && Array.isArray(result.data.categories)) {
        setCategories(result.data.categories);
        console.log('Categories fetched successfully:', result.data.categories);
      } else {
        setCategories([]);
        console.error('Invalid categories data:', result);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
      toast({
        title: 'Thất bại',
        description: 'Không thể tải danh sách danh mục',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);

      if (values.end_date <= values.start_date) {
        toast({
          title: 'Lỗi',
          description: 'Ngày kết thúc phải sau ngày bắt đầu',
          variant: 'destructive',
        });
        return;
      }

      const processedValues = {
        ...values,
        maximum_discount_amount:
          values.maximum_discount_amount !== null
            ? Number(values.maximum_discount_amount)
            : null,
        minimum_order_amount:
          values.minimum_order_amount !== null
            ? Number(values.minimum_order_amount)
            : null,
        usage_limit:
          values.usage_limit !== null ? Number(values.usage_limit) : null,
        discount_value: Number(values.discount_value),
      };

      const payload = {
        ...processedValues,
        start_date: values.start_date.toISOString(),
        end_date: values.end_date.toISOString(),
        product_ids: Array.isArray(values.product_ids)
          ? values.product_ids
          : [],
        category_ids: Array.isArray(values.category_ids)
          ? values.category_ids
          : [],
      };

      console.log('Submitting payload:', payload);

      if (isUpdate && promotion) {
        const result = await updatePromotion({
          id: promotion.id,
          ...payload,
        });
        if (result.status === 200) {
          toast({
            title: 'Thành công',
            description: 'Cập nhật khuyến mãi thành công',
          });
          onClose();
          onRefresh?.();
        }
      } else {
        const result = await createPromotion(payload);
        if (result.status === 201) {
          toast({
            title: 'Thành công',
            description: 'Tạo khuyến mãi thành công',
          });
          onClose();
          onRefresh?.();
        }
      }
    } catch (error: any) {
      console.error('Error submitting promotion:', error);
      let errorMessage = 'Có lỗi xảy ra, vui lòng thử lại';

      if (error.response?.data?.message) {
        const messages = error.response.data.message;
        errorMessage = Array.isArray(messages) ? messages.join(', ') : messages;
      }

      toast({
        title: 'Thất bại',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? 'Cập nhật khuyến mãi' : 'Thêm khuyến mãi mới'}
          </DialogTitle>
          <DialogDescription>
            {isUpdate
              ? 'Cập nhật thông tin khuyến mãi'
              : 'Thêm một khuyến mãi mới vào hệ thống'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên khuyến mãi</FormLabel>
                  <FormControl>
                    <Input placeholder='Nhập tên khuyến mãi' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Nhập mô tả khuyến mãi' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='discount_type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại giảm giá</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Chọn loại giảm giá' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='percentage'>
                          Phần trăm (%)
                        </SelectItem>
                        <SelectItem value='fixed'>Số tiền cố định</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='discount_value'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá trị giảm giá</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder={
                          form.watch('discount_type') === 'percentage'
                            ? 'Nhập % giảm giá'
                            : 'Nhập số tiền giảm'
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {form.watch('discount_type') === 'percentage'
                        ? 'Nhập giá trị từ 1-100'
                        : 'Nhập số tiền giảm giá'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='start_date'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Ngày bắt đầu</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'dd/MM/yyyy')
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='end_date'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Ngày kết thúc</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'dd/MM/yyyy')
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='minimum_order_amount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá trị đơn hàng tối thiểu</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Nhập giá trị đơn hàng tối thiểu'
                        {...field}
                        value={field.value === null ? '' : field.value}
                        onChange={(e) => {
                          const value =
                            e.target.value === ''
                              ? null
                              : Number(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Để trống nếu không có giới hạn
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='maximum_discount_amount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giảm giá tối đa</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Nhập giá trị giảm giá tối đa'
                        {...field}
                        value={field.value === null ? '' : field.value}
                        onChange={(e) => {
                          const value =
                            e.target.value === ''
                              ? null
                              : Number(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Áp dụng cho giảm giá theo phần trăm
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='usage_limit'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượt sử dụng tối đa</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Nhập số lượt sử dụng tối đa'
                      {...field}
                      value={field.value === null ? '' : field.value}
                      onChange={(e) => {
                        const value =
                          e.target.value === '' ? null : Number(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Để trống nếu không có giới hạn
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='product_ids'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sản phẩm và danh mục áp dụng</FormLabel>
                  <FormControl>
                    {isLoadingProducts || isLoadingCategories ? (
                      <Input disabled placeholder='Đang tải dữ liệu...' />
                    ) : (
                      <div className='border rounded-md'>
                        <div className='flex border-b'>
                          <button
                            type='button'
                            className={`flex-1 px-4 py-2 text-sm font-medium ${
                              activeTab === 'categories'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                            onClick={() => setActiveTab('categories')}
                          >
                            Danh mục
                          </button>
                          <button
                            type='button'
                            className={`flex-1 px-4 py-2 text-sm font-medium ${
                              activeTab === 'products'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                            onClick={() => setActiveTab('products')}
                          >
                            Sản phẩm
                          </button>
                        </div>

                        <div className='p-2'>
                          <Input
                            placeholder='Tìm kiếm...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='mb-2'
                          />
                        </div>

                        <ScrollArea className='h-[300px] p-2'>
                          {activeTab === 'categories' ? (
                            <div className='space-y-2'>
                              {Array.isArray(categories) &&
                                categories
                                  .filter((category) =>
                                    category.name
                                      .toLowerCase()
                                      .includes(searchTerm.toLowerCase())
                                  )
                                  .map((category) => {
                                    // Tìm tất cả sản phẩm thuộc danh mục này
                                    const productsInCategory = Array.isArray(
                                      products
                                    )
                                      ? products.filter((product) =>
                                          product.categories?.some(
                                            (c) => c.id === category.id
                                          )
                                        )
                                      : [];

                                    // Kiểm tra xem tất cả sản phẩm trong danh mục đã được chọn chưa
                                    const productIdsInCategory =
                                      productsInCategory.map((p) => p.id);
                                    const allProductsInCategorySelected =
                                      productIdsInCategory.length > 0 &&
                                      productIdsInCategory.every((id) =>
                                        field.value?.includes(id)
                                      );

                                    // Kiểm tra xem có sản phẩm nào trong danh mục được chọn không
                                    const someProductsInCategorySelected =
                                      productIdsInCategory.length > 0 &&
                                      productIdsInCategory.some((id) =>
                                        field.value?.includes(id)
                                      );

                                    return (
                                      <div
                                        key={category.id}
                                        className='space-y-1'
                                      >
                                        <div className='flex items-center space-x-2 bg-muted/50 p-2 rounded'>
                                          <Checkbox
                                            id={`category-${category.id}`}
                                            checked={
                                              allProductsInCategorySelected
                                            }
                                            className={
                                              someProductsInCategorySelected &&
                                              !allProductsInCategorySelected
                                                ? 'opacity-50'
                                                : ''
                                            }
                                            onCheckedChange={(checked) => {
                                              const currentValues =
                                                field.value || [];
                                              if (checked) {
                                                // Thêm tất cả sản phẩm trong danh mục
                                                const newProductIds = [
                                                  ...currentValues,
                                                ];
                                                productIdsInCategory.forEach(
                                                  (id) => {
                                                    if (
                                                      !newProductIds.includes(
                                                        id
                                                      )
                                                    ) {
                                                      newProductIds.push(id);
                                                    }
                                                  }
                                                );
                                                field.onChange(newProductIds);
                                              } else {
                                                // Loại bỏ tất cả sản phẩm trong danh mục
                                                field.onChange(
                                                  currentValues.filter(
                                                    (id) =>
                                                      !productIdsInCategory.includes(
                                                        id
                                                      )
                                                  )
                                                );
                                              }
                                            }}
                                          />
                                          <label
                                            htmlFor={`category-${category.id}`}
                                            className='text-sm font-medium leading-none'
                                          >
                                            {category.name} (
                                            {productsInCategory.length} sản
                                            phẩm)
                                          </label>
                                        </div>
                                      </div>
                                    );
                                  })}
                              {Array.isArray(categories) &&
                                categories.filter((category) =>
                                  category.name
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase())
                                ).length === 0 && (
                                  <p className='text-sm text-muted-foreground'>
                                    Không tìm thấy danh mục nào
                                  </p>
                                )}
                            </div>
                          ) : (
                            <div className='space-y-2'>
                              {Array.isArray(products) &&
                                products
                                  .filter((product) =>
                                    product.name
                                      .toLowerCase()
                                      .includes(searchTerm.toLowerCase())
                                  )
                                  .map((product) => (
                                    <div
                                      key={product.id}
                                      className='flex items-center space-x-2 hover:bg-muted/50 p-2 rounded'
                                    >
                                      <Checkbox
                                        id={`product-${product.id}`}
                                        checked={field.value?.includes(
                                          product.id
                                        )}
                                        onCheckedChange={(checked) => {
                                          const currentValues =
                                            field.value || [];
                                          if (checked) {
                                            field.onChange([
                                              ...currentValues,
                                              product.id,
                                            ]);
                                          } else {
                                            field.onChange(
                                              currentValues.filter(
                                                (id) => id !== product.id
                                              )
                                            );
                                          }
                                        }}
                                      />
                                      <label
                                        htmlFor={`product-${product.id}`}
                                        className='text-sm font-medium leading-none flex-1'
                                      >
                                        {product.name}
                                      </label>
                                      <span className='text-xs text-muted-foreground'>
                                        {categories.find((c) =>
                                          product.categories?.some(
                                            (p) => p.id === c.id
                                          )
                                        )?.name || 'Không có danh mục'}
                                      </span>
                                    </div>
                                  ))}
                              {Array.isArray(products) &&
                                products.filter((product) =>
                                  product.name
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase())
                                ).length === 0 && (
                                  <p className='text-sm text-muted-foreground'>
                                    Không tìm thấy sản phẩm nào
                                  </p>
                                )}
                            </div>
                          )}
                        </ScrollArea>

                        <div className='p-2 border-t'>
                          <div className='text-sm text-muted-foreground'>
                            Đã chọn: {field.value?.length || 0} sản phẩm
                          </div>
                        </div>
                      </div>
                    )}
                  </FormControl>
                  <FormDescription>
                    Để trống nếu áp dụng cho tất cả sản phẩm
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='is_active'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Kích hoạt</FormLabel>
                    <FormDescription>
                      Khuyến mãi sẽ được áp dụng ngay khi đến thời gian bắt đầu
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading
                  ? 'Đang xử lý...'
                  : isUpdate
                  ? 'Cập nhật'
                  : 'Tạo mới'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
