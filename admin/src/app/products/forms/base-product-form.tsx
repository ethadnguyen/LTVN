import { Controller, UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { CategoryMention } from '@/components/category/category-mention';
import { CategoryRes } from '@/services/types/response/category-res';
import { ProductFormValues } from '../product-schema';
import { useState } from 'react';
import { ProductType } from '@/services/types/request/product-req';
import { Card, CardContent } from '@/components/ui/card';
import { ImagePlus, Plus, X, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadMultipleImages } from '@/services/modules/file.service';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BaseProductFormProps {
  form: UseFormReturn<ProductFormValues>;
  categories: CategoryRes[];
  specs?: Record<string, string>;
  specKey?: string;
  specValue?: string;
  setSpecKey?: (value: string) => void;
  setSpecValue?: (value: string) => void;
  handleAddSpec?: () => void;
  handleRemoveSpec?: (key: string) => void;
}

export const BaseProductForm = ({
  form,
  categories,
  specs = {},
  specKey = '',
  specValue = '',
  setSpecKey = () => {},
  setSpecValue = () => {},
  handleAddSpec = () => {},
  handleRemoveSpec = () => {},
}: BaseProductFormProps) => {
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('vi-VN');
  };

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: number) => void
  ) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    const value = parseInt(rawValue, 10);
    onChange(isNaN(value) ? 0 : Math.max(0, value));
  };

  const handleUrlAdd = () => {
    const currentImages = form.getValues('images') || [];
    if (imageUrl && !currentImages.includes(imageUrl)) {
      form.setValue('images', [...currentImages, imageUrl]);
      setImageUrl('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });

      const response = await uploadMultipleImages(formData);
      console.log('response', response);
      if (response.data?.success && response.data?.images?.urls) {
        const currentImages = form.getValues('images') || [];
        const uploadedUrls = Array.isArray(response.data.images.urls)
          ? response.data.images.urls
          : [response.data.images.urls];
        form.setValue('images', [...currentImages, ...uploadedUrls]);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      // Reset input file
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = form.getValues('images') || [];
    const newImages = [...currentImages];
    newImages.splice(index, 1);
    form.setValue('images', newImages);
  };

  // Chuyển đổi enum ProductType thành mảng để hiển thị trong select
  const productTypes = Object.values(ProductType);

  // Hàm chuyển đổi tên loại sản phẩm thành tên hiển thị thân thiện hơn
  const getProductTypeDisplayName = (type: string): string => {
    switch (type) {
      case ProductType.CPU:
        return 'CPU (Bộ vi xử lý)';
      case ProductType.GPU:
        return 'GPU (Card đồ họa)';
      case ProductType.RAM:
        return 'RAM (Bộ nhớ)';
      case ProductType.MAINBOARD:
        return 'Mainboard (Bo mạch chủ)';
      case ProductType.STORAGE:
        return 'Storage (Ổ cứng)';
      case ProductType.POWER_SUPPLY:
        return 'PSU (Nguồn máy tính)';
      case ProductType.COOLING:
        return 'Cooling (Tản nhiệt)';
      case ProductType.CASE:
        return 'Case (Vỏ máy tính)';
      default:
        return type;
    }
  };

  return (
    <>
      <div className='grid gap-2'>
        <Label htmlFor='name'>Tên sản phẩm</Label>
        <Controller
          name='name'
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Input {...field} placeholder='Nhập tên sản phẩm' />
              {fieldState.error && (
                <span className='text-sm text-destructive'>
                  {fieldState.error.message}
                </span>
              )}
            </>
          )}
        />
      </div>

      <div className='grid gap-2'>
        <Label htmlFor='type'>Loại sản phẩm</Label>
        <Controller
          name='type'
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Select
                value={field.value ? field.value.toString() : ProductType.CPU}
                onValueChange={(value) => field.onChange(value as ProductType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Chọn loại sản phẩm' />
                </SelectTrigger>
                <SelectContent>
                  {productTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {getProductTypeDisplayName(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.error && (
                <span className='text-sm text-destructive'>
                  {fieldState.error.message}
                </span>
              )}
            </>
          )}
        />
      </div>

      <div className='grid gap-2'>
        <Label htmlFor='description'>Mô tả</Label>
        <Controller
          name='description'
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Textarea {...field} placeholder='Nhập mô tả sản phẩm' />
              {fieldState.error && (
                <span className='text-sm text-destructive'>
                  {fieldState.error.message}
                </span>
              )}
            </>
          )}
        />
      </div>

      <div className='grid gap-2'>
        <Label htmlFor='price'>Giá (VNĐ)</Label>
        <Controller
          name='price'
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <div className='relative'>
                <Input
                  type='text'
                  {...field}
                  value={formatCurrency(field.value)}
                  onChange={(e) => handlePriceChange(e, field.onChange)}
                  placeholder='Nhập giá sản phẩm'
                  className={`pr-12 ${
                    fieldState.error ? 'border-destructive' : ''
                  }`}
                />
                <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground'>
                  VNĐ
                </div>
              </div>
              {fieldState.error && (
                <span className='text-sm text-destructive'>
                  {fieldState.error.message}
                </span>
              )}
            </>
          )}
        />
      </div>

      <div className='grid gap-2'>
        <Label htmlFor='stock'>Số lượng</Label>
        <Controller
          name='stock'
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Input
                {...field}
                type='number'
                min='0'
                placeholder='Nhập số lượng'
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (isNaN(value)) {
                    field.onChange(0);
                  } else {
                    field.onChange(Math.max(0, value));
                  }
                }}
                className={fieldState.error ? 'border-destructive' : ''}
              />
              {fieldState.error && (
                <span className='text-sm text-destructive'>
                  {fieldState.error.message}
                </span>
              )}
            </>
          )}
        />
      </div>

      <div className='grid gap-2'>
        <Label>Danh mục</Label>
        <Controller
          name='category_id'
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <CategoryMention
                value={field.value || []}
                onChange={(values) => {
                  field.onChange(values);
                }}
                categories={categories}
                className='w-full'
              />
              {fieldState.error && (
                <span className='text-sm text-destructive'>
                  {fieldState.error.message}
                </span>
              )}
            </>
          )}
        />
      </div>

      <Card>
        <CardContent className='pt-6'>
          <Label className='mb-2 block font-medium'>Thông số kỹ thuật</Label>
          <div className='flex items-end gap-2 mb-4'>
            <div className='flex-1'>
              <Label htmlFor='spec-key'>Thuộc tính</Label>
              <Input
                id='spec-key'
                value={specKey}
                onChange={(e) => setSpecKey(e.target.value)}
                placeholder='Ví dụ: Kích thước, Màu sắc...'
              />
            </div>
            <div className='flex-1'>
              <Label htmlFor='spec-value'>Giá trị</Label>
              <Input
                id='spec-value'
                value={specValue}
                onChange={(e) => setSpecValue(e.target.value)}
                placeholder='Ví dụ: 15 inch, Đen...'
              />
            </div>
            <Button
              type='button'
              onClick={handleAddSpec}
              disabled={!specKey.trim() || !specValue.trim()}
            >
              <Plus className='h-4 w-4 mr-1' /> Thêm
            </Button>
          </div>

          <div className='border rounded-md p-2'>
            <h3 className='text-sm font-medium mb-2'>Thông số đã thêm</h3>
            {Object.keys(specs).length === 0 ? (
              <p className='text-sm text-muted-foreground'>
                Chưa có thông số nào
              </p>
            ) : (
              <div className='flex flex-wrap gap-2'>
                {Object.entries(specs).map(([key, value]) => (
                  <div
                    key={key}
                    className='flex items-center gap-1 bg-secondary text-secondary-foreground py-1 px-2 rounded-md text-sm'
                  >
                    <span>
                      <strong>{key}:</strong> {value}
                    </span>
                    <X
                      className='h-3 w-3 cursor-pointer hover:text-destructive'
                      onClick={() => handleRemoveSpec(key)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='pt-6'>
          <Label className='mb-2 block font-medium'>Hình ảnh sản phẩm</Label>
          <div className='grid gap-4'>
            <div className='flex items-end gap-2'>
              <div className='flex-1'>
                <Label htmlFor='image-url'>Thêm ảnh từ URL</Label>
                <div className='flex gap-2'>
                  <Input
                    id='image-url'
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder='Nhập URL ảnh...'
                  />
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleUrlAdd}
                    disabled={!imageUrl}
                  >
                    <LinkIcon className='h-4 w-4 mr-1' />
                    Thêm
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor='image-upload'>Tải ảnh từ thiết bị</Label>
              <div className='mt-1'>
                <label
                  htmlFor='image-upload'
                  className={cn(
                    'flex justify-center items-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none',
                    isUploading && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <div className='flex flex-col items-center space-y-2'>
                    <ImagePlus className='w-8 h-8 text-gray-400' />
                    <span className='text-sm text-gray-500'>
                      {isUploading ? 'Đang tải lên...' : 'Nhấp để chọn ảnh'}
                    </span>
                  </div>
                  <input
                    id='image-upload'
                    type='file'
                    className='hidden'
                    multiple
                    accept='image/*'
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>
          </div>

          <Controller
            name='images'
            control={form.control}
            render={({ field }) => (
              <div className='mt-4'>
                {field.value && field.value.length > 0 && (
                  <div>
                    <Label>Ảnh đã thêm</Label>
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2'>
                      {field.value.map((url, index) => (
                        <div
                          key={index}
                          className='relative group aspect-square'
                        >
                          <Image
                            src={url}
                            alt={`Product image ${index + 1}`}
                            fill
                            sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
                            className='object-cover rounded-lg'
                            loading='lazy'
                            quality={75}
                          />
                          <button
                            type='button'
                            onClick={() => handleRemoveImage(index)}
                            className='absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                            title='Xóa ảnh'
                            aria-label='Xóa ảnh'
                          >
                            <X className='h-4 w-4' />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          />
        </CardContent>
      </Card>

      <div className='flex items-center space-x-2'>
        <Controller
          name='is_active'
          control={form.control}
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
        <Label>Đang bán</Label>
      </div>
    </>
  );
};
