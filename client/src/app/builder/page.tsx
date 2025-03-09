'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
} from '@dnd-kit/core';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProductCard } from '@/components/builder/product-card';
import { BuilderSlot } from '@/components/builder/builder-slot';
import { formatCurrency } from '@/lib/utils';
import { compatibilityService } from '@/services/modules/compatibility.service';
import { getActiveProducts } from '@/services/modules/product.service';
import { getActiveCategories } from '@/services/modules/category.service';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {
  ProductRes,
  ProductType,
} from '@/services/types/response/product_types/product.res';
import { CategoryRes } from '@/services/types/response/category_types/category.res';
import PaginationWrapper from '@/components/custom/pagination-wrapper';

const ITEMS_PER_PAGE = 9;

interface BuilderItem {
  product: ProductRes;
  quantity: number;
}

export default function BuilderPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeProduct, setActiveProduct] = useState<ProductRes | null>(null);
  const [products, setProducts] = useState<ProductRes[]>([]);
  const [categories, setCategories] = useState<CategoryRes[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [builderItems, setBuilderItems] = useState<
    Record<ProductType, BuilderItem | undefined>
  >({
    [ProductType.CPU]: undefined,
    [ProductType.MAINBOARD]: undefined,
    [ProductType.RAM]: undefined,
    [ProductType.GPU]: undefined,
    [ProductType.STORAGE]: undefined,
    [ProductType.POWER_SUPPLY]: undefined,
    [ProductType.CASE]: undefined,
    [ProductType.COOLING]: undefined,
  });
  const [compatibility, setCompatibility] = useState<{
    isCompatible: boolean;
    messages: string[];
  } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getActiveCategories({ is_active: true });
        setCategories(response.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description:
            'Không thể tải danh sách danh mục. Vui lòng thử lại sau.',
        });
      }
    };

    fetchCategories();
  }, []);

  // Configure sensors for better drag and drop experience
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 300,
        tolerance: 8,
      },
    })
  );

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await getActiveProducts({
          page: currentPage,
          size: ITEMS_PER_PAGE,
          category_id: selectedCategory?.toString(),
          search: searchTerm || undefined,
        });

        setProducts(response.data.products);
        setTotalPages(Math.ceil(response.total / ITEMS_PER_PAGE));
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description:
            'Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchProducts();
    }
  }, [selectedCategory, searchTerm, currentPage]);

  // Kiểm tra tương thích khi thay đổi builderItems
  useEffect(() => {
    const checkBuildCompatibility = async () => {
      const selectedItems = Object.values(builderItems).filter(
        (item) => item !== undefined
      );
      if (selectedItems.length < 2) {
        setCompatibility(null);
        return;
      }

      setIsChecking(true);
      try {
        const request = {
          products: selectedItems.map((item) => ({
            product_id: String(item!.product.id),
            product_type: item!.product.type,
          })),
        };

        const result = await compatibilityService.checkCompatibility(request);
        setCompatibility(result);

        if (!result.isCompatible) {
          toast({
            variant: 'destructive',
            title: 'Cảnh báo tương thích',
            description: result.messages.join('\n'),
          });
        }
      } catch (error) {
        console.error('Error checking compatibility:', error);
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: 'Không thể kiểm tra tương thích. Vui lòng thử lại sau.',
        });
      } finally {
        setIsChecking(false);
      }
    };

    checkBuildCompatibility();
  }, [builderItems]);

  // Handlers
  function handleDragStart(event: DragStartEvent) {
    if (event.active.data.current) {
      setActiveProduct(event.active.data.current.product);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveProduct(null);
    const { active, over } = event;

    if (over && active.data.current) {
      const product = active.data.current.product as ProductRes;
      const category = over.id as ProductType;

      if (category === product.type) {
        setBuilderItems((prev) => ({
          ...prev,
          [category]: {
            product,
            quantity: 1,
          },
        }));
      }
    }
  }

  function handleQuantityChange(category: ProductType, quantity: number) {
    setBuilderItems((prev) => ({
      ...prev,
      [category]: prev[category]
        ? {
            ...prev[category]!,
            quantity,
          }
        : undefined,
    }));
  }

  function handleRemoveItem(category: ProductType) {
    setBuilderItems((prev) => ({
      ...prev,
      [category]: undefined,
    }));
  }

  function handleSaveConfig() {
    // In a real app, this would save to your backend
    console.log('Saving configuration:', builderItems);
  }

  const totalPrice = Object.values(builderItems)
    .filter(Boolean)
    .reduce((total, item) => total + item!.product.price * item!.quantity, 0);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className='container mx-auto px-4 py-8'>
        <div className='grid gap-8 lg:grid-cols-[300px_1fr_400px]'>
          {/* Categories */}
          <div className='space-y-4'>
            <Input
              placeholder='Search Categories'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className='space-y-2'>
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                className='w-full justify-start'
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? 'default' : 'outline'
                  }
                  className='w-full justify-start'
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className='space-y-4'>
            <Input
              placeholder='Search Products'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {isLoading ? (
              <div className='flex justify-center items-center min-h-[400px]'>
                <Loader2 className='w-8 h-8 animate-spin' />
              </div>
            ) : (
              <>
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className='mt-4 flex justify-center'>
                    <PaginationWrapper
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Builder */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h2 className='text-2xl font-bold'>Configuration</h2>
              <Button onClick={handleSaveConfig}>Save Config</Button>
            </div>

            {/* Hiển thị kết quả kiểm tra tương thích */}
            {compatibility && (
              <Alert
                className={
                  compatibility.isCompatible ? 'bg-green-50' : 'bg-red-50'
                }
              >
                <AlertDescription>
                  <div className='flex flex-col gap-2'>
                    <div
                      className={`font-semibold ${
                        compatibility.isCompatible
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {compatibility.isCompatible
                        ? 'Các linh kiện tương thích với nhau'
                        : 'Phát hiện vấn đề về tương thích'}
                    </div>
                    {!compatibility.isCompatible && (
                      <ul className='list-disc list-inside space-y-1'>
                        {compatibility.messages.map((message, index) => (
                          <li key={index} className='text-sm text-red-600'>
                            {message}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className='space-y-4'>
              {Object.values(ProductType).map((type) => (
                <BuilderSlot
                  key={type}
                  category={type}
                  item={builderItems[type]}
                  onQuantityChange={(quantity) =>
                    handleQuantityChange(type, quantity)
                  }
                  onRemove={() => handleRemoveItem(type)}
                />
              ))}
            </div>

            <div className='rounded-lg border p-4'>
              <div className='text-2xl font-bold'>
                Total: {formatCurrency(totalPrice)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeProduct ? (
          <div className='opacity-80'>
            <ProductCard product={activeProduct} isDraggable={false} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
