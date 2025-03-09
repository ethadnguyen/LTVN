import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/shared/product-card';
import { CategoryCard } from '@/components/shared/category-card';
import {
  Cpu,
  CircuitBoard,
  MemoryStickIcon as Memory,
  CpuIcon as Gpu,
  HardDrive,
  Box,
  Laptop,
  Gamepad,
  Keyboard,
  Mouse,
} from 'lucide-react';
import type { CategoryRes } from '@/services/types/response/category_types/category.res';

const categories: CategoryRes[] = [
  {
    id: 1,
    name: 'Linh kiện PC',
    parent: null,
    children: [],
    description: 'Các linh kiện máy tính',
    slug: 'linh-kien-pc',
    is_active: true,
    created_at: '',
    updated_at: '',
    icon: Box,
  },
  {
    id: 2,
    name: 'Laptop',
    parent: null,
    children: [],
    description: 'Máy tính xách tay',
    slug: 'laptop',
    is_active: true,
    created_at: '',
    updated_at: '',
    icon: Laptop,
  },
  {
    id: 3,
    name: 'CPU',
    parent: null,
    children: [],
    description: 'Bộ vi xử lý',
    slug: 'cpu',
    is_active: true,
    created_at: '',
    updated_at: '',
    icon: Cpu,
  },
  {
    id: 4,
    name: 'Mainboard',
    parent: null,
    children: [],
    description: 'Bo mạch chủ',
    slug: 'mainboard',
    is_active: true,
    created_at: '',
    updated_at: '',
    icon: CircuitBoard,
  },
  {
    id: 5,
    name: 'RAM',
    parent: null,
    children: [],
    description: 'Bộ nhớ RAM',
    slug: 'ram',
    is_active: true,
    created_at: '',
    updated_at: '',
    icon: Memory,
  },
  {
    id: 6,
    name: 'VGA',
    parent: null,
    children: [],
    description: 'Card đồ họa',
    slug: 'vga',
    is_active: true,
    created_at: '',
    updated_at: '',
    icon: Gpu,
  },
  {
    id: 7,
    name: 'Ổ cứng',
    parent: null,
    children: [],
    description: 'Ổ cứng SSD/HDD',
    slug: 'storage',
    is_active: true,
    created_at: '',
    updated_at: '',
    icon: HardDrive,
  },
  {
    id: 8,
    name: 'Gaming Gear',
    parent: null,
    children: [],
    description: 'Phụ kiện gaming',
    slug: 'gaming-gear',
    is_active: true,
    created_at: '',
    updated_at: '',
    icon: Gamepad,
  },
  {
    id: 9,
    name: 'Bàn phím',
    parent: null,
    children: [],
    description: 'Bàn phím',
    slug: 'ban-phim',
    is_active: true,
    created_at: '',
    updated_at: '',
    icon: Keyboard,
  },
  {
    id: 10,
    name: 'Chuột',
    parent: null,
    children: [],
    description: 'Chuột',
    slug: 'chuot',
    is_active: true,
    created_at: '',
    updated_at: '',
    icon: Mouse,
  },
];

// Cập nhật dữ liệu mẫu để loại bỏ isNew và đổi tên isSale thành is_sale
const featuredProducts = [
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
    name: 'NVIDIA GeForce RTX 3070',
    slug: 'nvidia-geforce-rtx-3070',
    price: 15990000,
    image: '/placeholder.svg?height=300&width=300',
    rating: 4.8,
    category: 'VGA',
    is_sale: true,
  },
  {
    id: '3',
    name: 'Kingston FURY Beast 32GB DDR4 3200MHz',
    slug: 'kingston-fury-beast-32gb-ddr4-3200mhz',
    price: 2490000,
    image: '/placeholder.svg?height=300&width=300',
    rating: 4.6,
    category: 'RAM',
    is_sale: false,
  },
  {
    id: '4',
    name: 'Samsung 970 EVO Plus 1TB NVMe SSD',
    slug: 'samsung-970-evo-plus-1tb-nvme-ssd',
    price: 2990000,
    image: '/placeholder.svg?height=300&width=300',
    rating: 4.9,
    category: 'SSD',
    is_sale: true,
  },
  {
    id: '5',
    name: 'ASUS ROG Strix B550-F Gaming',
    slug: 'asus-rog-strix-b550-f-gaming',
    price: 4590000,
    image: '/placeholder.svg?height=300&width=300',
    rating: 4.7,
    category: 'Mainboard',
    is_sale: false,
  },
];

export default function Home() {
  return (
    <div className='container-custom'>
      {/* Hero Banner */}
      <section className='mb-12'>
        <div className='relative rounded-lg overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-background border'>
          <div className='p-8 md:p-12 lg:p-16 max-w-2xl'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold mb-4'>
              Xây dựng PC mơ ước của bạn
            </h1>
            <p className='text-muted-foreground mb-6'>
              Linh kiện chính hãng, giá cả cạnh tranh, bảo hành uy tín
            </p>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Button size='lg' asChild>
                <Link href='/pc-builder'>PC Builder</Link>
              </Button>
              <Button size='lg' variant='outline' asChild>
                <Link href='/category/all'>Xem sản phẩm</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className='mb-12'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-bold'>Danh mục sản phẩm</h2>
          <Button variant='link' asChild>
            <Link href='/category/all'>Xem tất cả</Link>
          </Button>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              slug={category.slug}
              icon={category.icon || Box}
              productCount={Math.floor(Math.random() * 100) + 10} // Giả lập số lượng sản phẩm
            />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className='mb-12'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-bold'>Sản phẩm nổi bật</h2>
          <Button variant='link' asChild>
            <Link href='/category/featured'>Xem tất cả</Link>
          </Button>
        </div>
        <div className='product-grid'>
          {featuredProducts.map((product) => (
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
      </section>

      {/* PC Builder Promo */}
      <section className='mb-12'>
        <div className='rounded-lg overflow-hidden bg-gradient-to-r from-primary/20 to-primary/5 border'>
          <div className='p-6 md:p-8'>
            <h2 className='text-2xl md:text-3xl font-bold mb-4'>
              Xây dựng cấu hình PC của bạn
            </h2>
            <p className='text-muted-foreground mb-6 max-w-2xl'>
              Sử dụng công cụ PC Builder của chúng tôi để tạo cấu hình PC phù
              hợp với nhu cầu và ngân sách của bạn. Chúng tôi sẽ kiểm tra tính
              tương thích giữa các linh kiện để đảm bảo hệ thống hoạt động tốt
              nhất.
            </p>
            <div>
              <Button size='lg' asChild>
                <Link href='/pc-builder'>Bắt đầu ngay</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
