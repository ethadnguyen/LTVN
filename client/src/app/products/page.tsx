'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { products } from '@/data/products';
import { categories, type Category } from '@/data/categories';
import { routes } from '@/utils/routes';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialCategoryId = searchParams.get('category');

  const [filters, setFilters] = useState({
    categories: new Set<number>(
      initialCategoryId ? [Number.parseInt(initialCategoryId)] : []
    ),
    brands: new Set<string>(),
    priceRange: { min: 0, max: Number.POSITIVE_INFINITY },
  });
  const [searchTerm, setSearchTerm] = useState('');

  const brands = [...new Set(products.map((p) => p.brand))];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        filters.categories.size === 0 ||
        filters.categories.has(product.categoryId);
      const matchesBrand =
        filters.brands.size === 0 || filters.brands.has(product.brand);
      const matchesPriceRange =
        product.price >= filters.priceRange.min &&
        product.price <= filters.priceRange.max;
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

      return (
        matchesCategory && matchesBrand && matchesPriceRange && matchesSearch
      );
    });
  }, [filters, searchTerm]);

  const handleCategoryChange = useCallback(
    (categoryId: number, isChecked: boolean) => {
      setFilters((prev) => {
        const newCategories = new Set(prev.categories);
        if (isChecked) {
          newCategories.add(categoryId);
        } else {
          newCategories.delete(categoryId);
        }
        return { ...prev, categories: newCategories };
      });
    },
    []
  );

  const handleBrandChange = (brand: string, isChecked: boolean) => {
    setFilters((prev) => {
      const newBrands = new Set(prev.brands);
      if (isChecked) {
        newBrands.add(brand);
      } else {
        newBrands.delete(brand);
      }
      return { ...prev, brands: newBrands };
    });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setFilters((prev) => ({ ...prev, priceRange: { min, max } }));
  };

  const renderCategoryTree = (category: Category) => (
    <div key={category.id} className='ml-4'>
      <div className='flex items-center space-x-2'>
        <Checkbox
          id={`category-${category.id}`}
          checked={filters.categories.has(category.id)}
          onCheckedChange={(checked) =>
            handleCategoryChange(category.id, checked as boolean)
          }
        />
        <label htmlFor={`category-${category.id}`}>{category.name}</label>
      </div>
      {category.childrenCategories.map(renderCategoryTree)}
    </div>
  );

  useEffect(() => {
    if (initialCategoryId) {
      handleCategoryChange(Number.parseInt(initialCategoryId), true);
    }
  }, [initialCategoryId, handleCategoryChange]);

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>Sản phẩm</h1>

      <div className='flex flex-col md:flex-row gap-8'>
        <div className='w-full md:w-1/4 space-y-6'>
          <div>
            <Label htmlFor='search'>Tìm kiếm</Label>
            <Input
              id='search'
              placeholder='Tìm kiếm sản phẩm...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Accordion type='single' collapsible className='w-full'>
            <AccordionItem value='category'>
              <AccordionTrigger>Danh mục</AccordionTrigger>
              <AccordionContent>
                {categories.map(renderCategoryTree)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value='brand'>
              <AccordionTrigger>Thương hiệu</AccordionTrigger>
              <AccordionContent>
                {brands.map((brand) => (
                  <div key={brand} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`brand-${brand}`}
                      checked={filters.brands.has(brand)}
                      onCheckedChange={(checked) =>
                        handleBrandChange(brand, checked as boolean)
                      }
                    />
                    <label htmlFor={`brand-${brand}`}>{brand}</label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value='price'>
              <AccordionTrigger>Khoảng giá</AccordionTrigger>
              <AccordionContent>
                <div className='space-y-2'>
                  <div>
                    <Label htmlFor='min-price'>Giá tối thiểu</Label>
                    <Input
                      id='min-price'
                      type='number'
                      value={filters.priceRange.min}
                      onChange={(e) =>
                        handlePriceRangeChange(
                          Number(e.target.value),
                          filters.priceRange.max
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor='max-price'>Giá tối đa</Label>
                    <Input
                      id='max-price'
                      type='number'
                      value={
                        filters.priceRange.max === Number.POSITIVE_INFINITY
                          ? ''
                          : filters.priceRange.max
                      }
                      onChange={(e) =>
                        handlePriceRangeChange(
                          filters.priceRange.min,
                          e.target.value
                            ? Number(e.target.value)
                            : Number.POSITIVE_INFINITY
                        )
                      }
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className='w-full md:w-3/4'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredProducts.map((product) => (
              <Card key={product.id} className='flex flex-col'>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                </CardHeader>
                <CardContent className='flex-grow'>
                  <Image
                    src={product.image || '/placeholder.svg'}
                    alt={product.name}
                    width={300}
                    height={300}
                    className='w-full h-48 object-cover mb-4 rounded-md'
                  />
                  <p className='text-2xl font-bold'>
                    {product.price.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </p>
                  <p className='text-sm text-gray-500'>{product.brand}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild className='w-full'>
                    <Link
                      href={routes.productDetails(product.id.toString()).path}
                    >
                      Xem chi tiết
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
