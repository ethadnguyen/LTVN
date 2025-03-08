'use client';

import { useState } from 'react';
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
import type {
  Product,
  ProductCategory,
  BuilderItem,
} from '@/services/types/response/product_types/product.res';
import { checkCompatibility } from '@/lib/compatibility';
import { formatCurrency } from '@/lib/utils';

// Example products - In a real app, this would come from your database
const products: Product[] = [
  {
    id: '1',
    name: 'AMD Ryzen 9 7950X',
    price: 699,
    category: 'CPU',
    image: '/placeholder.svg',
    specs: {
      socket: 'AM5',
      cores: 16,
      threads: 32,
      tdp: 170,
    },
  },
  {
    id: '2',
    name: 'ASUS ROG STRIX X670E-E GAMING WIFI',
    price: 499,
    category: 'MOTHERBOARD',
    image: '/placeholder.svg',
    specs: {
      socket: 'AM5',
      memory: {
        type: 'DDR5',
        maxSpeed: '6400MHz',
      },
    },
  },
  // Add more products...
];

const categories: ProductCategory[] = [
  'CPU',
  'MOTHERBOARD',
  'RAM',
  'GPU',
  'STORAGE',
  'PSU',
  'CASE',
  'COOLING',
];

export default function BuilderPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [builderItems, setBuilderItems] = useState<
    Record<ProductCategory, BuilderItem | undefined>
  >({
    CPU: undefined,
    MOTHERBOARD: undefined,
    RAM: undefined,
    GPU: undefined,
    STORAGE: undefined,
    PSU: undefined,
    CASE: undefined,
    COOLING: undefined,
  });

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

  const compatibility = checkCompatibility(
    Object.values(builderItems).filter(Boolean) as BuilderItem[]
  );

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPrice = Object.values(builderItems)
    .filter(Boolean)
    .reduce((total, item) => total + item!.product.price * item!.quantity, 0);

  function handleDragStart(event: DragStartEvent) {
    if (event.active.data.current) {
      setActiveProduct(event.active.data.current.product);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveProduct(null);
    const { active, over } = event;

    if (over && active.data.current) {
      const product = active.data.current.product as Product;
      const category = over.id as ProductCategory;

      if (category === product.category) {
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

  function handleQuantityChange(category: ProductCategory, quantity: number) {
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

  function handleRemoveItem(category: ProductCategory) {
    setBuilderItems((prev) => ({
      ...prev,
      [category]: undefined,
    }));
  }

  function handleSaveConfig() {
    // In a real app, this would save to your backend
    console.log('Saving configuration:', builderItems);
  }

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
                  key={category}
                  variant={
                    selectedCategory === category ? 'default' : 'outline'
                  }
                  className='w-full justify-start'
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
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
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* Builder */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h2 className='text-2xl font-bold'>Configuration</h2>
              <Button onClick={handleSaveConfig}>Save Config</Button>
            </div>

            <Alert
              variant={compatibility.isCompatible ? 'default' : 'destructive'}
            >
              <AlertDescription>
                {compatibility.messages.map((message, i) => (
                  <div key={i}>{message}</div>
                ))}
              </AlertDescription>
            </Alert>

            <div className='space-y-4'>
              {categories.map((category) => (
                <BuilderSlot
                  key={category}
                  category={category}
                  item={builderItems[category]}
                  onQuantityChange={(quantity) =>
                    handleQuantityChange(category, quantity)
                  }
                  onRemove={() => handleRemoveItem(category)}
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
