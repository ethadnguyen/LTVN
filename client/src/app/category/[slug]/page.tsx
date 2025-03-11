'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProductCard } from '@/components/shared/product-card';
import { CategoryTree } from '@/components/shared/category-tree';
import { Breadcrumb } from '@/components/custom/breadcrumb';
import { PaginationWrapper } from '@/components/custom/pagination-wrapper';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  getActiveCategories,
  getCategoryBySlug,
} from '@/services/modules/category.service';
import {
  getActiveProducts,
  getProductsByCategorySlug,
} from '@/services/modules/product.service';
import { getActiveBrands } from '@/services/modules/brand.service';
import type { CategoryRes } from '@/services/types/response/category_types/category.res';
import type { ProductRes } from '@/services/types/response/product_types/product.res';
import { useToast } from '@/hooks/use-toast';

// Định nghĩa interface BrandRes
interface BrandRes {
  id: number;
  name: string;
  description?: string;
  slug?: string;
  is_active?: boolean;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { toast } = useToast();

  const [categories, setCategories] = useState<CategoryRes[]>([]);
  const [products, setProducts] = useState<ProductRes[]>([]);
  const [currentCategory, setCurrentCategory] = useState<CategoryRes | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [productsPerPage] = useState(12);

  // Thêm các state cho filter
  const [brands, setBrands] = useState<BrandRes[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000000]);
  const [isSale, setIsSale] = useState<boolean | undefined>(undefined);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getActiveCategories();
        setCategories(categoriesData.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh mục sản phẩm',
          variant: 'destructive',
        });
      }
    };

    fetchCategories();
  }, [toast]);

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandsData = await getActiveBrands();
        setBrands(brandsData.brands || []);
      } catch (error) {
        console.error('Error fetching brands:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải thương hiệu',
          variant: 'destructive',
        });
      }
    };

    fetchBrands();
  }, [toast]);

  // Fetch products based on category slug
  useEffect(() => {
    const fetchProductsData = async () => {
      setLoading(true);
      try {
        // Chuẩn bị tham số cho API
        const apiParams: {
          page: number;
          size: number;
          is_active: boolean;
          search?: string;
          min_price?: number;
          max_price?: number;
          is_sale?: boolean;
          min_rating?: number;
          brands?: string;
        } = {
          page: currentPage,
          size: productsPerPage,
          is_active: true,
          search: debouncedSearchTerm || undefined,
        };

        if (priceRange[0] > 0) {
          apiParams.min_price = priceRange[0];
        }

        if (priceRange[1] < 20000000) {
          apiParams.max_price = priceRange[1];
        }

        // Thêm các tham số filter khác
        if (isSale !== undefined) {
          apiParams.is_sale = isSale;
        }

        if (minRating !== undefined) {
          apiParams.min_rating = minRating;
        }

        if (selectedBrands.length > 0) {
          apiParams.brands = selectedBrands.join(',');
        }

        console.log('API Params:', apiParams); // Log để debug

        // Xử lý trường hợp đặc biệt cho "all"
        if (slug === 'all') {
          const productsData = await getActiveProducts(apiParams);

          setProducts(productsData.products || []);
          setTotalPages(productsData.totalPages || 1);
          setTotalProducts(productsData.total || 0);
          setCurrentCategory(null);
        } else {
          // Fetch category info
          try {
            const categoryData = await getCategoryBySlug(slug);
            setCurrentCategory(categoryData);
          } catch (error) {
            console.error('Error fetching category:', error);
            setCurrentCategory(null);
          }

          // Fetch products by category slug
          const productsData = await getProductsByCategorySlug(slug, apiParams);

          setProducts(productsData.products || []);
          setTotalPages(productsData.totalPages || 1);
          setTotalProducts(productsData.total || 0);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải sản phẩm',
          variant: 'destructive',
        });
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProductsData();
    }
  }, [
    slug,
    currentPage,
    productsPerPage,
    toast,
    debouncedSearchTerm,
    priceRange,
    isSale,
    minRating,
    selectedBrands,
  ]);

  // Xác định tên danh mục và mô tả
  let categoryName = 'Tất cả sản phẩm';
  let categoryDescription = 'Tất cả sản phẩm có sẵn trong cửa hàng';
  let parentCategory = null;
  let childCategories: CategoryRes[] = [];

  if (slug !== 'all' && currentCategory) {
    categoryName = currentCategory.name;
    categoryDescription = currentCategory.description;
    parentCategory = currentCategory.parent;
    childCategories =
      currentCategory.children?.filter((child) => child.is_active) || [];
  }

  // Tạo breadcrumb items
  const breadcrumbItems = [{ label: 'Trang chủ', href: '/' }];

  if (slug === 'all') {
    breadcrumbItems.push({ label: 'Tất cả sản phẩm', active: true });
  } else {
    if (parentCategory) {
      breadcrumbItems.push({
        label: parentCategory.name,
        href: `/category/${parentCategory.slug}`,
      });
    }
    breadcrumbItems.push({ label: categoryName, active: true });
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    // Implement sorting logic here
  };

  // Handle brand selection
  const handleBrandChange = (brandName: string) => {
    setSelectedBrands((prev) => {
      if (prev.includes(brandName)) {
        return prev.filter((b) => b !== brandName);
      } else {
        return [...prev, brandName];
      }
    });
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle price range change
  const handlePriceRangeChange = (value: [number, number]) => {
    console.log('Price range changed:', value);
    setPriceRange(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle sale status change
  const handleSaleStatusChange = (checked: boolean) => {
    setIsSale(checked ? true : undefined);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle filter reset
  const handleResetFilters = () => {
    setSelectedBrands([]);
    setPriceRange([0, 20000000]);
    setIsSale(undefined);
    setMinRating(undefined);
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    // Filters are already applied via useEffect dependencies
    // This function is for the Apply button UI feedback
    toast({
      title: 'Bộ lọc đã được áp dụng',
      description: 'Danh sách sản phẩm đã được cập nhật',
    });
  };

  return (
    <div className='container-custom'>
      <div className='mb-6'>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className='flex flex-col md:flex-row gap-8'>
        {/* Sidebar Filters */}
        <div className='w-full md:w-64 shrink-0 space-y-6'>
          <div className='border rounded-lg p-4'>
            <h3 className='font-medium mb-4'>Tìm kiếm</h3>
            <div className='relative'>
              <input
                type='text'
                placeholder='Tìm sản phẩm...'
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

          <div className='border rounded-lg p-4'>
            <h3 className='font-medium mb-4'>Danh mục</h3>
            <CategoryTree categories={categories} currentCategorySlug={slug} />
          </div>

          <div className='border rounded-lg p-4'>
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

          <div className='border rounded-lg p-4'>
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

          <div className='border rounded-lg p-4'>
            <h3 className='font-medium mb-4'>Tình trạng</h3>
            <div className='space-y-2'>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='status-sale'
                  checked={isSale === true}
                  onChange={(e) => handleSaleStatusChange(e.target.checked)}
                  className='h-4 w-4 rounded border-gray-300'
                />
                <label
                  htmlFor='status-sale'
                  className='ml-2 text-sm font-medium'
                >
                  Đang giảm giá
                </label>
              </div>
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
            <Button className='flex-1' onClick={handleApplyFilters}>
              Áp dụng
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className='flex-1'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
            <div>
              <h1 className='text-2xl font-bold mb-1'>{categoryName}</h1>
              {categoryDescription && (
                <p className='text-muted-foreground mb-2'>
                  {categoryDescription}
                </p>
              )}
              <p className='text-muted-foreground'>
                Hiển thị {products.length} / {totalProducts} sản phẩm
              </p>
            </div>
            <div className='flex items-center gap-4'>
              <Select defaultValue={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Sắp xếp theo' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='featured'>Nổi bật</SelectItem>
                  <SelectItem value='price-asc'>Giá: Thấp đến cao</SelectItem>
                  <SelectItem value='price-desc'>Giá: Cao đến thấp</SelectItem>
                  <SelectItem value='newest'>Mới nhất</SelectItem>
                  <SelectItem value='rating'>Đánh giá cao</SelectItem>
                </SelectContent>
              </Select>
              <div className='flex items-center gap-2'>
                <Button variant='outline' size='icon'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='h-4 w-4'
                  >
                    <rect width='7' height='7' x='3' y='3' rx='1' />
                    <rect width='7' height='7' x='14' y='3' rx='1' />
                    <rect width='7' height='7' x='14' y='14' rx='1' />
                    <rect width='7' height='7' x='3' y='14' rx='1' />
                  </svg>
                </Button>
                <Button variant='outline' size='icon'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='h-4 w-4'
                  >
                    <line x1='3' x2='21' y1='6' y2='6' />
                    <line x1='3' x2='21' y1='12' y2='12' />
                    <line x1='3' x2='21' y1='18' y2='18' />
                  </svg>
                </Button>
              </div>
            </div>
          </div>

          {/* Hiển thị danh mục con (nếu có) */}
          {childCategories.length > 0 && (
            <div className='mb-8'>
              <h2 className='text-lg font-medium mb-4'>Danh mục con</h2>
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {childCategories.map((child) => (
                  <a
                    key={child.id}
                    href={`/category/${child.slug}`}
                    className='flex flex-col items-center justify-center p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors text-center'
                  >
                    <h3 className='font-medium'>{child.name}</h3>
                  </a>
                ))}
              </div>
            </div>
          )}

          {loading ? (
            <div className='flex items-center justify-center h-96'>
              <p className='text-lg'>Đang tải sản phẩm...</p>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className='product-grid'>
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id.toString()}
                    name={product.name}
                    slug={product.slug}
                    price={product.price}
                    image={
                      product.images && product.images.length > 0
                        ? product.images[0]
                        : '/placeholder.svg?height=300&width=300'
                    }
                    rating={product.rating || 0}
                    category={product.type}
                    is_sale={product.is_sale || false}
                    sale_price={product.sale_price || 0}
                  />
                ))}
              </div>

              <div className='mt-8'>
                <PaginationWrapper
                  currentPage={currentPage}
                  totalItems={totalProducts}
                  pageSize={productsPerPage}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          ) : (
            <div className='flex items-center justify-center h-96'>
              <p className='text-lg'>
                Không có sản phẩm nào trong danh mục này
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
