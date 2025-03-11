'use client';

import { useState, useEffect } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { PCBuilderItem } from './pc-builder-item';
import { PCBuilderDroppable } from './pc-builder-droppable';
import { PCBuilderDraggable } from './pc-builder-draggable';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { getActiveProducts } from '@/services/modules/product.service';
import { compatibilityService } from '@/services/modules/compatibility.service';
import { CompatibilityRequest } from '@/services/types/request/compatibility_types/compatibility.req';
import { CompatibilityResponse } from '@/services/types/response/compatibility_types/compatibility.res';
import { getActiveBrands } from '@/services/modules/brand.service';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BrandRes } from '@/services/types/response/brand_types/brand.res';

interface Component {
  id: string;
  type: string;
  name: string;
  image: string;
  price: number;
  compatibility: string[];
  brand?: BrandRes;
}

const componentTypes = [
  { id: 'CPU', name: 'CPU' },
  { id: 'MAINBOARD', name: 'Mainboard' },
  { id: 'RAM', name: 'RAM' },
  { id: 'GPU', name: 'VGA' },
  { id: 'STORAGE', name: 'Ổ cứng' },
  { id: 'POWER_SUPPLY', name: 'Nguồn' },
  { id: 'CASE', name: 'Vỏ case' },
  { id: 'COOLING', name: 'Tản nhiệt' },
];

// Ánh xạ từ loại component trong UI sang loại sản phẩm trong API
const componentTypeMapping: { [key: string]: string } = {
  CPU: 'CPU',
  MAINBOARD: 'MAINBOARD',
  RAM: 'RAM',
  GPU: 'GPU',
  STORAGE: 'STORAGE',
  POWER_SUPPLY: 'POWER_SUPPLY',
  CASE: 'CASE',
  COOLING: 'COOLING',
};

export function PCBuilderComponent() {
  const { toast } = useToast();
  const [selectedComponents, setSelectedComponents] = useState<{
    [key: string]: Component | null;
  }>({
    CPU: null,
    MAINBOARD: null,
    RAM: null,
    GPU: null,
    STORAGE: null,
    POWER_SUPPLY: null,
    CASE: null,
    COOLING: null,
  });

  const [compatibilityMessages, setCompatibilityMessages] = useState<string[]>(
    []
  );

  const [isCompatible, setIsCompatible] = useState<boolean>(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [availableComponents, setAvailableComponents] = useState<Component[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);

  // State cho bộ lọc
  const [brands, setBrands] = useState<BrandRes[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000000]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [selectedComponentType, setSelectedComponentType] =
    useState<string>('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Lấy danh sách thương hiệu từ API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandsData = await getActiveBrands();
        setBrands(brandsData.brands || []);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách thương hiệu:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải thương hiệu',
          variant: 'destructive',
        });
      }
    };

    fetchBrands();
  }, [toast]);

  // Lấy danh sách sản phẩm từ API khi component được tải
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Chuẩn bị tham số cho API
        const apiParams: {
          is_active: boolean;
          search?: string;
          min_price?: number;
          max_price?: number;
          brands?: string;
          type?: string;
        } = {
          is_active: true,
          search: debouncedSearchTerm || undefined,
        };

        if (priceRange[0] > 0) {
          apiParams.min_price = priceRange[0];
        }

        if (priceRange[1] < 20000000) {
          apiParams.max_price = priceRange[1];
        }

        if (selectedBrands.length > 0) {
          apiParams.brands = selectedBrands.join(',');
        }

        if (selectedComponentType) {
          apiParams.type = componentTypeMapping[selectedComponentType];
        }

        const productsData = await getActiveProducts(apiParams);

        // Chuyển đổi dữ liệu sản phẩm từ API sang định dạng Component
        const components: Component[] = productsData.products.map(
          (product: {
            id: string;
            type: string;
            name: string;
            images: string[];
            price: number;
            brand?:
              | string
              | {
                  name: string;
                  id: string;
                  slug: string;
                  is_active: boolean;
                  created_at: string;
                  updated_at: string;
                };
          }) => ({
            id: product.id,
            type: product.type,
            name: product.name,
            image: product.images[0] || '/placeholder.svg',
            price: product.price,
            compatibility: [],
            brand:
              typeof product.brand === 'string'
                ? product.brand
                : product.brand?.name || '',
          })
        );

        setAvailableComponents(components);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách sản phẩm',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    debouncedSearchTerm,
    priceRange,
    selectedBrands,
    selectedComponentType,
    toast,
  ]);

  // Kiểm tra tương thích khi các thành phần được chọn thay đổi
  useEffect(() => {
    const checkCompatibility = async () => {
      // Chỉ kiểm tra khi có ít nhất 2 thành phần được chọn
      const selectedComponentsList = Object.entries(selectedComponents)
        .filter(([, component]) => component !== null)
        .map(([type, component]) => ({
          type,
          component: component!,
        }));

      if (selectedComponentsList.length < 2) {
        setCompatibilityMessages([]);
        setIsCompatible(true);
        return;
      }

      try {
        // Tạo request để kiểm tra tương thích
        const compatibilityRequest: CompatibilityRequest = {
          products: selectedComponentsList.map(({ type, component }) => ({
            product_id: component.id,
            product_type: componentTypeMapping[type],
          })),
        };

        // Gọi API kiểm tra tương thích
        const response: CompatibilityResponse =
          await compatibilityService.checkCompatibility(compatibilityRequest);

        setCompatibilityMessages(response.messages);
        setIsCompatible(response.isCompatible);
      } catch (error) {
        console.error('Lỗi khi kiểm tra tương thích:', error);
        setCompatibilityMessages([
          'Đã xảy ra lỗi khi kiểm tra tương thích. Vui lòng thử lại sau.',
        ]);
        setIsCompatible(false);
      }
    };

    checkCompatibility();
  }, [selectedComponents]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Log toàn bộ event để debug
    // console.log('=== DEBUG DRAG END ===');
    // console.log('Event:', event);
    // console.log('Active:', active);
    // console.log('Over:', over);
    // console.log('Available components:', availableComponents);

    if (over && active.id !== over.id) {
      const component = availableComponents.find(
        (comp) => Number(comp.id) === Number(active.id)
      );
      console.log('Found component:', component);

      const targetType = over.id.toString();
      console.log('Target type:', targetType);

      if (component && targetType) {
        // Log chi tiết về types
        // console.log('Component type (from API):', component.type);
        // console.log('Target type (UI):', targetType);
        // console.log('Component type mapping:', componentTypeMapping);

        // Chỉ cho phép kéo thả nếu loại component phù hợp với ô
        if (component.type === targetType) {
          // console.log('Types match! Updating selected components...');
          // Cập nhật thành phần được chọn
          const newSelectedComponents = {
            ...selectedComponents,
            [targetType]: component,
          };
          setSelectedComponents(newSelectedComponents);

          // Cập nhật tổng giá
          const newTotalPrice = Object.values(newSelectedComponents)
            .filter(Boolean)
            .reduce((sum, comp) => sum + (comp?.price || 0), 0);
          setTotalPrice(newTotalPrice);
        } else {
          toast({
            title: 'Không thể thêm linh kiện',
            description: `Linh kiện này không phải là ${
              componentTypes.find((type) => type.id === targetType)?.name
            }`,
            variant: 'destructive',
          });
        }
      }
    }
  };

  const handleRemoveComponent = (type: string) => {
    const newSelectedComponents = {
      ...selectedComponents,
      [type]: null,
    };
    setSelectedComponents(newSelectedComponents);

    // Cập nhật tổng giá
    const newTotalPrice = Object.values(newSelectedComponents)
      .filter(Boolean)
      .reduce((sum, comp) => sum + (comp?.price || 0), 0);
    setTotalPrice(newTotalPrice);
  };

  // Xử lý thay đổi thương hiệu
  const handleBrandChange = (brandName: string) => {
    setSelectedBrands((prev) => {
      if (prev.includes(brandName)) {
        return prev.filter((b) => b !== brandName);
      } else {
        return [...prev, brandName];
      }
    });
  };

  // Xử lý thay đổi khoảng giá
  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRange(value);
  };

  // Xử lý thay đổi tìm kiếm
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Xử lý đặt lại bộ lọc
  const handleResetFilters = () => {
    setSelectedBrands([]);
    setPriceRange([0, 20000000]);
    setSearchTerm('');
    setSelectedComponentType('');
  };

  // Xử lý thay đổi loại linh kiện
  const handleComponentTypeChange = (value: string) => {
    setSelectedComponentType(value === 'all' ? '' : value);
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='md:col-span-2 space-y-6'>
          <div className='bg-card rounded-lg border p-6'>
            <h2 className='text-2xl font-bold mb-6'>Xây dựng cấu hình PC</h2>

            {!isCompatible && compatibilityMessages.length > 0 && (
              <Alert variant='destructive' className='mb-6'>
                <AlertCircle className='h-4 w-4' />
                <AlertTitle>Cảnh báo tương thích</AlertTitle>
                <AlertDescription>
                  <ul className='list-disc pl-4 mt-2'>
                    {compatibilityMessages.map((message, index) => (
                      <li key={index}>{message}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {isCompatible &&
              Object.values(selectedComponents).some(Boolean) && (
                <Alert className='mb-6 bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800'>
                  <CheckCircle2 className='h-4 w-4 text-green-600 dark:text-green-400' />
                  <AlertTitle>Cấu hình tương thích</AlertTitle>
                  <AlertDescription>
                    Các linh kiện đã chọn tương thích với nhau.
                  </AlertDescription>
                </Alert>
              )}

            <div className='space-y-4'>
              {componentTypes.map((type) => (
                <div key={type.id} className='flex items-center gap-4'>
                  <div className='w-32 font-medium'>{type.name}</div>
                  <div className='flex-1'>
                    <PCBuilderDroppable id={type.id}>
                      {selectedComponents[type.id] ? (
                        <PCBuilderItem
                          component={selectedComponents[type.id]!}
                          onRemove={() => handleRemoveComponent(type.id)}
                        />
                      ) : (
                        <div className='text-muted-foreground text-sm'>
                          Kéo thả linh kiện vào đây
                        </div>
                      )}
                    </PCBuilderDroppable>
                  </div>
                </div>
              ))}
            </div>

            <div className='mt-6 flex justify-between items-center'>
              <div className='text-lg font-bold'>
                Tổng tiền: {totalPrice.toLocaleString()}đ
              </div>
              <Button
                disabled={
                  !Object.values(selectedComponents).some(Boolean) ||
                  !isCompatible
                }
              >
                Mua cấu hình này
              </Button>
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          {/* Bộ lọc */}
          <div className='bg-card rounded-lg border p-4'>
            <h3 className='font-medium mb-4'>Tìm kiếm</h3>
            <div className='relative'>
              <input
                type='text'
                placeholder='Tìm linh kiện...'
                value={searchTerm}
                onChange={handleSearchChange}
                className='w-full p-2 border rounded-md'
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div className='bg-card rounded-lg border p-4'>
            <h3 className='font-medium mb-4'>Loại linh kiện</h3>
            <Select
              value={
                selectedComponentType === '' ? 'all' : selectedComponentType
              }
              onValueChange={handleComponentTypeChange}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Chọn loại linh kiện' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tất cả</SelectItem>
                {componentTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='bg-card rounded-lg border p-4'>
            <h3 className='font-medium mb-4'>Giá</h3>
            <div className='space-y-6'>
              <Slider
                defaultValue={[0, 20000000]}
                value={priceRange}
                onValueChange={handlePriceRangeChange}
                min={0}
                max={20000000}
                step={100000}
                className='z-0'
              />
              <div className='flex items-center justify-between'>
                <span className='text-sm'>
                  {priceRange[0].toLocaleString('vi-VN')}đ
                </span>
                <span className='text-sm'>
                  {priceRange[1].toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          </div>

          <div className='bg-card rounded-lg border p-4'>
            <h3 className='font-medium mb-4'>Thương hiệu</h3>
            <div className='space-y-2 max-h-48 overflow-y-auto'>
              {brands.length > 0 ? (
                brands.map((brand) => (
                  <div key={brand.id} className='flex items-center'>
                    <input
                      type='checkbox'
                      id={`brand-${brand.id}`}
                      checked={selectedBrands.includes(brand.name)}
                      onChange={() => handleBrandChange(brand.name)}
                      className='h-4 w-4 rounded border-gray-300'
                    />
                    <label
                      htmlFor={`brand-${brand.id}`}
                      className='ml-2 text-sm font-medium'
                    >
                      {brand.name}
                    </label>
                  </div>
                ))
              ) : (
                <p className='text-sm text-muted-foreground'>
                  Không có thương hiệu
                </p>
              )}
            </div>
          </div>

          <div className='flex gap-2'>
            <Button
              variant='outline'
              className='flex-1'
              onClick={handleResetFilters}
            >
              Đặt lại
            </Button>
          </div>

          {/* Danh sách linh kiện */}
          <div className='bg-card rounded-lg border p-6'>
            <h3 className='text-xl font-bold mb-4'>Linh kiện có sẵn</h3>
            {loading ? (
              <div className='text-center py-4'>
                Đang tải danh sách linh kiện...
              </div>
            ) : availableComponents.length > 0 ? (
              <div className='space-y-4'>
                <SortableContext
                  items={availableComponents.map((comp) => comp.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {availableComponents.map((component) => (
                    <PCBuilderDraggable key={component.id} id={component.id}>
                      <div className='border rounded-md p-2 flex items-center gap-2'>
                        <div className='relative h-12 w-12 shrink-0'>
                          <img
                            src={component.image || '/placeholder.svg'}
                            alt={component.name}
                            className='object-cover rounded-md'
                          />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm font-medium truncate'>
                            {component.name}
                          </p>
                          <div className='flex justify-between items-center'>
                            <p className='text-xs text-muted-foreground'>
                              {component.price.toLocaleString()}đ
                            </p>
                            {component.brand && (
                              <p className='text-xs text-muted-foreground'>
                                {typeof component.brand === 'string'
                                  ? component.brand
                                  : (component.brand as BrandRes)?.name || ''}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </PCBuilderDraggable>
                  ))}
                </SortableContext>
              </div>
            ) : (
              <div className='text-center py-4'>
                Không tìm thấy linh kiện phù hợp với bộ lọc
              </div>
            )}
          </div>
        </div>
      </div>
    </DndContext>
  );
}
