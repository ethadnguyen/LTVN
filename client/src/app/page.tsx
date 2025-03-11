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
  LucideIcon,
} from 'lucide-react';
import type { CategoryRes } from '@/services/types/response/category_types/category.res';
import { getActiveCategories } from '@/services/modules/category.service';
import { getFeaturedProducts } from '@/services/modules/product.service';
import { ProductRes } from '@/services/types/response/product_types/product.res';

const iconMap: Record<string, LucideIcon> = {
  Box,
  Cpu,
  CircuitBoard,
  Memory,
  Gpu,
  HardDrive,
  Laptop,
  Gamepad,
  Keyboard,
  Mouse,
};

export default async function Home() {
  const categoriesData = await getActiveCategories();
  const categories: CategoryRes[] = categoriesData.categories || [];

  const featuredProductsData = await getFeaturedProducts({ size: 8 });
  const featuredProducts: ProductRes[] = featuredProductsData.products || [];

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
                <Link href='/builder'>PC Builder</Link>
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
          {categories.map((category) => {
            const IconComponent =
              category.icon && typeof category.icon === 'string'
                ? iconMap[category.icon] || Box
                : Box;

            return (
              <CategoryCard
                key={category.id}
                name={category.name}
                slug={category.slug}
                icon={IconComponent}
                productCount={category.products_count}
              />
            );
          })}
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
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
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
            ))
          ) : (
            <p className='col-span-full text-center text-muted-foreground py-8'>
              Không có sản phẩm nổi bật nào.
            </p>
          )}
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
                <Link href='/builder'>Bắt đầu ngay</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
