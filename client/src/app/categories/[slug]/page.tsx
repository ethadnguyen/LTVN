'use client';

import { useState } from 'react';
import { ProductCard } from '@/components/shared/product-card';
import { CategoryTree } from '@/components/shared/category-tree';
import { Breadcrumb } from '@/components/custom/breadcrumb';
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import type { CategoryRes } from '@/services/types/response/category_types/category.res';

const categories: CategoryRes[] = [
  {
    id: 1,
    name: 'Linh kiện PC',
    parent: null,
    children: [
      {
        id: 11,
        name: 'CPU',
        parent: {
          id: 1,
          name: 'Linh kiện PC',
          parent: null,
          children: [],
          description: '',
          slug: 'linh-kien-pc',
          is_active: true,
          created_at: '',
          updated_at: '',
        },
        children: [
          {
            id: 111,
            name: 'Intel',
            parent: {
              id: 11,
              name: 'CPU',
              parent: null,
              children: [],
              description: '',
              slug: 'cpu',
              is_active: true,
              created_at: '',
              updated_at: '',
            },
            children: [],
            description: 'CPU Intel',
            slug: 'cpu-intel',
            is_active: true,
            created_at: '',
            updated_at: '',
          },
          {
            id: 112,
            name: 'AMD',
            parent: {
              id: 11,
              name: 'CPU',
              parent: null,
              children: [],
              description: '',
              slug: 'cpu',
              is_active: true,
              created_at: '',
              updated_at: '',
            },
            children: [],
            description: 'CPU AMD',
            slug: 'cpu-amd',
            is_active: true,
            created_at: '',
            updated_at: '',
          },
        ],
        description: 'Bộ vi xử lý',
        slug: 'cpu',
        is_active: true,
        created_at: '',
        updated_at: '',
      },
      {
        id: 12,
        name: 'Mainboard',
        parent: {
          id: 1,
          name: 'Linh kiện PC',
          parent: null,
          children: [],
          description: '',
          slug: 'linh-kien-pc',
          is_active: true,
          created_at: '',
          updated_at: '',
        },
        children: [],
        description: 'Bo mạch chủ',
        slug: 'mainboard',
        is_active: true,
        created_at: '',
        updated_at: '',
      },
      {
        id: 13,
        name: 'RAM',
        parent: {
          id: 1,
          name: 'Linh kiện PC',
          parent: null,
          children: [],
          description: '',
          slug: 'linh-kien-pc',
          is_active: true,
          created_at: '',
          updated_at: '',
        },
        children: [],
        description: 'Bộ nhớ RAM',
        slug: 'ram',
        is_active: true,
        created_at: '',
        updated_at: '',
      },
      {
        id: 14,
        name: 'VGA',
        parent: {
          id: 1,
          name: 'Linh kiện PC',
          parent: null,
          children: [],
          description: '',
          slug: 'linh-kien-pc',
          is_active: true,
          created_at: '',
          updated_at: '',
        },
        children: [],
        description: 'Card đồ họa',
        slug: 'vga',
        is_active: true,
        created_at: '',
        updated_at: '',
      },
    ],
    description: 'Các linh kiện máy tính',
    slug: 'linh-kien-pc',
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 2,
    name: 'Laptop',
    parent: null,
    children: [
      {
        id: 21,
        name: 'Gaming',
        parent: {
          id: 2,
          name: 'Laptop',
          parent: null,
          children: [],
          description: '',
          slug: 'laptop',
          is_active: true,
          created_at: '',
          updated_at: '',
        },
        children: [],
        description: 'Laptop Gaming',
        slug: 'laptop-gaming',
        is_active: true,
        created_at: '',
        updated_at: '',
      },
      {
        id: 22,
        name: 'Văn phòng',
        parent: {
          id: 2,
          name: 'Laptop',
          parent: null,
          children: [],
          description: '',
          slug: 'laptop',
          is_active: true,
          created_at: '',
          updated_at: '',
        },
        children: [],
        description: 'Laptop Văn phòng',
        slug: 'laptop-van-phong',
        is_active: true,
        created_at: '',
        updated_at: '',
      },
    ],
    description: 'Máy tính xách tay',
    slug: 'laptop',
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 3,
    name: 'Màn hình',
    parent: null,
    children: [],
    description: 'Màn hình máy tính',
    slug: 'man-hinh',
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 4,
    name: 'Phụ kiện',
    parent: null,
    children: [
      {
        id: 41,
        name: 'Bàn phím',
        parent: {
          id: 4,
          name: 'Phụ kiện',
          parent: null,
          children: [],
          description: '',
          slug: 'phu-kien',
          is_active: true,
          created_at: '',
          updated_at: '',
        },
        children: [],
        description: 'Bàn phím',
        slug: 'ban-phim',
        is_active: true,
        created_at: '',
        updated_at: '',
      },
      {
        id: 42,
        name: 'Chuột',
        parent: {
          id: 4,
          name: 'Phụ kiện',
          parent: null,
          children: [],
          description: '',
          slug: 'phu-kien',
          is_active: true,
          created_at: '',
          updated_at: '',
        },
        children: [],
        description: 'Chuột',
        slug: 'chuot',
        is_active: true,
        created_at: '',
        updated_at: '',
      },
      {
        id: 43,
        name: 'Tai nghe',
        parent: {
          id: 4,
          name: 'Phụ kiện',
          parent: null,
          children: [],
          description: '',
          slug: 'phu-kien',
          is_active: true,
          created_at: '',
          updated_at: '',
        },
        children: [],
        description: 'Tai nghe',
        slug: 'tai-nghe',
        is_active: true,
        created_at: '',
        updated_at: '',
      },
    ],
    description: 'Phụ kiện máy tính',
    slug: 'phu-kien',
    is_active: true,
    created_at: '',
    updated_at: '',
  },
];

// Cập nhật dữ liệu mẫu để loại bỏ isNew và đổi tên isSale thành is_sale
const products = [
  {
    id: '1',
    name: 'AMD Ryzen 7 5800X',
    slug: 'amd-ryzen-7-5800x',
    price: 7990000,
    image: '/placeholder.svg?height=300&width=300',
    rating: 4.5,
    category: 'CPU',
    is_sale: true,
  },
  {
    id: '2',
    name: 'AMD Ryzen 5 5600X',
    slug: 'amd-ryzen-5-5600x',
    price: 4990000,
    image: '/placeholder.svg?height=300&width=300',
    rating: 4.6,
    category: 'CPU',
    is_sale: true,
  },
  {
    id: '3',
    name: 'AMD Ryzen 9 5900X',
    slug: 'amd-ryzen-9-5900x',
    price: 11990000,
    image: '/placeholder.svg?height=300&width=300',
    rating: 4.8,
    category: 'CPU',
    is_sale: true,
  },
  {
    id: '4',
    name: 'Intel Core i5-12600K',
    slug: 'intel-core-i5-12600k',
    price: 7490000,
    image: '/placeholder.svg?height=300&width=300',
    rating: 4.7,
    category: 'CPU',
    is_sale: false,
  },
  {
    id: '5',
    name: 'Intel Core i7-12700K',
    slug: 'intel-core-i7-12700k',
    price: 9990000,
    image: '/placeholder.svg?height=300&width=300',
    rating: 4.9,
    category: 'CPU',
    is_sale: false,
  },
  {
    id: '6',
    name: 'Intel Core i9-12900K',
    slug: 'intel-core-i9-12900k',
    price: 14990000,
    image: '/placeholder.svg?height=300&width=300',
    rating: 4.9,
    category: 'CPU',
    is_sale: true,
  },
];

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const [currentPage, setCurrentPage] = useState(1);

  // Tìm danh mục hiện tại
  const findCategory = (
    categories: CategoryRes[],
    slug: string
  ): CategoryRes | undefined => {
    for (const category of categories) {
      if (category.slug === slug) {
        return category;
      }

      if (category.children.length > 0) {
        const found = findCategory(category.children, slug);
        if (found) return found;
      }
    }
    return undefined;
  };

  const currentCategory = findCategory(categories, slug);
  const categoryName =
    currentCategory?.name || slug.charAt(0).toUpperCase() + slug.slice(1);
  const categoryDescription = currentCategory?.description || '';

  // Xác định danh mục cha (nếu có)
  const parentCategory = currentCategory?.parent;

  // Xác định danh mục con (nếu có)
  const childCategories =
    currentCategory?.children.filter((child) => child.is_active) || [];

  // Tạo breadcrumb items
  const breadcrumbItems = [{ label: 'Trang chủ', href: '/' }];

  if (parentCategory) {
    breadcrumbItems.push({
      label: parentCategory.name,
      href: `/category/${parentCategory.slug}`,
    });
  }

  breadcrumbItems.push({ label: categoryName, active: true });

  return (
    <div className='container-custom'>
      <div className='mb-6'>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className='flex flex-col md:flex-row gap-8'>
        {/* Sidebar Filters */}
        <div className='w-full md:w-64 shrink-0 space-y-6'>
          <div className='border rounded-lg p-4'>
            <h3 className='font-medium mb-4'>Danh mục</h3>
            <CategoryTree categories={categories} currentCategorySlug={slug} />
          </div>

          <div>
            <h3 className='font-medium mb-4'>Giá</h3>
            <div className='space-y-6'>
              <Slider defaultValue={[0, 100]} />
              <div className='flex items-center justify-between'>
                <span className='text-sm'>0đ</span>
                <span className='text-sm'>20.000.000đ</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className='font-medium mb-4'>Thương hiệu</h3>
            <div className='space-y-2'>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='brand-amd'
                  className='h-4 w-4 rounded border-gray-300'
                />
                <label htmlFor='brand-amd' className='ml-2 text-sm font-medium'>
                  AMD
                </label>
              </div>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='brand-intel'
                  className='h-4 w-4 rounded border-gray-300'
                />
                <label
                  htmlFor='brand-intel'
                  className='ml-2 text-sm font-medium'
                >
                  Intel
                </label>
              </div>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='brand-asus'
                  className='h-4 w-4 rounded border-gray-300'
                />
                <label
                  htmlFor='brand-asus'
                  className='ml-2 text-sm font-medium'
                >
                  Asus
                </label>
              </div>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='brand-msi'
                  className='h-4 w-4 rounded border-gray-300'
                />
                <label htmlFor='brand-msi' className='ml-2 text-sm font-medium'>
                  MSI
                </label>
              </div>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='brand-gigabyte'
                  className='h-4 w-4 rounded border-gray-300'
                />
                <label
                  htmlFor='brand-gigabyte'
                  className='ml-2 text-sm font-medium'
                >
                  Gigabyte
                </label>
              </div>
            </div>
          </div>

          <div>
            <h3 className='font-medium mb-4'>Tình trạng</h3>
            <div className='space-y-2'>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='status-new'
                  className='h-4 w-4 rounded border-gray-300'
                />
                <label
                  htmlFor='status-new'
                  className='ml-2 text-sm font-medium'
                >
                  Mới
                </label>
              </div>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='status-sale'
                  className='h-4 w-4 rounded border-gray-300'
                />
                <label
                  htmlFor='status-sale'
                  className='ml-2 text-sm font-medium'
                >
                  Giảm giá
                </label>
              </div>
            </div>
          </div>

          <Button className='w-full'>Áp dụng bộ lọc</Button>
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
                Hiển thị {products.length} sản phẩm
              </p>
            </div>
            <div className='flex items-center gap-4'>
              <Select defaultValue='featured'>
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

          <div className='product-grid'>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.price}
                image={product.image}
                rating={product.rating}
                category={product.category}
                is_sale={product.is_sale}
              />
            ))}
          </div>

          <div className='mt-8'>
            <Pagination
              currentPage={currentPage}
              totalPages={5}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
