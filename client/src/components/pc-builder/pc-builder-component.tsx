'use client';

import { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
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

interface Component {
  id: string;
  type: string;
  name: string;
  image: string;
  price: number;
  compatibility: string[];
}

const componentTypes = [
  { id: 'cpu', name: 'CPU' },
  { id: 'mainboard', name: 'Mainboard' },
  { id: 'ram', name: 'RAM' },
  { id: 'vga', name: 'VGA' },
  { id: 'storage', name: 'Ổ cứng' },
  { id: 'psu', name: 'Nguồn' },
  { id: 'case', name: 'Vỏ case' },
  { id: 'cooling', name: 'Tản nhiệt' },
];

const sampleComponents: Component[] = [
  {
    id: 'cpu1',
    type: 'cpu',
    name: 'Intel Core i5-12400F',
    image: '/placeholder.svg?height=100&width=100',
    price: 3990000,
    compatibility: ['lga1700'],
  },
  {
    id: 'cpu2',
    type: 'cpu',
    name: 'AMD Ryzen 5 5600X',
    image: '/placeholder.svg?height=100&width=100',
    price: 4590000,
    compatibility: ['am4'],
  },
  {
    id: 'mb1',
    type: 'mainboard',
    name: 'Gigabyte B660M DS3H',
    image: '/placeholder.svg?height=100&width=100',
    price: 2790000,
    compatibility: ['lga1700', 'ddr4'],
  },
  {
    id: 'mb2',
    type: 'mainboard',
    name: 'MSI B550M PRO-VDH WIFI',
    image: '/placeholder.svg?height=100&width=100',
    price: 2590000,
    compatibility: ['am4', 'ddr4'],
  },
  {
    id: 'ram1',
    type: 'ram',
    name: 'Kingston Fury Beast 16GB (2x8GB) DDR4 3200MHz',
    image: '/placeholder.svg?height=100&width=100',
    price: 1290000,
    compatibility: ['ddr4'],
  },
  {
    id: 'ram2',
    type: 'ram',
    name: 'G.Skill Trident Z RGB 32GB (2x16GB) DDR4 3600MHz',
    image: '/placeholder.svg?height=100&width=100',
    price: 2790000,
    compatibility: ['ddr4'],
  },
];

export function PCBuilderComponent() {
  const [selectedComponents, setSelectedComponents] = useState<{
    [key: string]: Component | null;
  }>({
    cpu: null,
    mainboard: null,
    ram: null,
    vga: null,
    storage: null,
    psu: null,
    case: null,
    cooling: null,
  });

  const [compatibilityMessages, setCompatibilityMessages] = useState<string[]>(
    []
  );

  const [totalPrice, setTotalPrice] = useState(0);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const component = sampleComponents.find((comp) => comp.id === active.id);
      const targetType = over.id;

      if (component && targetType) {
        // Check compatibility
        const newMessages: string[] = [];
        let isCompatible = true;

        // Example compatibility check logic
        if (
          targetType === 'mainboard' &&
          selectedComponents.cpu &&
          !component.compatibility.some((c) =>
            selectedComponents.cpu?.compatibility.includes(c)
          )
        ) {
          newMessages.push('Mainboard không tương thích với CPU đã chọn!');
          isCompatible = false;
        }

        if (
          targetType === 'ram' &&
          selectedComponents.mainboard &&
          !component.compatibility.some((c) =>
            selectedComponents.mainboard?.compatibility.includes(c)
          )
        ) {
          newMessages.push('RAM không tương thích với Mainboard đã chọn!');
          isCompatible = false;
        }

        setCompatibilityMessages(newMessages);

        if (isCompatible) {
          // Update selected components
          const newSelectedComponents = {
            ...selectedComponents,
            [component.type]: component,
          };
          setSelectedComponents(newSelectedComponents);

          // Update total price
          const newTotalPrice = Object.values(newSelectedComponents)
            .filter(Boolean)
            .reduce((sum, comp) => sum + (comp?.price || 0), 0);
          setTotalPrice(newTotalPrice);
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

    // Update total price
    const newTotalPrice = Object.values(newSelectedComponents)
      .filter(Boolean)
      .reduce((sum, comp) => sum + (comp?.price || 0), 0);
    setTotalPrice(newTotalPrice);

    // Recalculate compatibility
    setCompatibilityMessages([]);
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='md:col-span-2 space-y-6'>
          <div className='bg-card rounded-lg border p-6'>
            <h2 className='text-2xl font-bold mb-6'>Xây dựng cấu hình PC</h2>

            {compatibilityMessages.length > 0 && (
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

            {compatibilityMessages.length === 0 &&
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
                disabled={!Object.values(selectedComponents).some(Boolean)}
              >
                Mua cấu hình này
              </Button>
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          <div className='bg-card rounded-lg border p-6'>
            <h3 className='text-xl font-bold mb-4'>Linh kiện có sẵn</h3>
            <div className='space-y-4'>
              <SortableContext
                items={sampleComponents.map((comp) => comp.id)}
                strategy={verticalListSortingStrategy}
              >
                {sampleComponents.map((component) => (
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
                        <p className='text-xs text-muted-foreground'>
                          {component.price.toLocaleString()}đ
                        </p>
                      </div>
                    </div>
                  </PCBuilderDraggable>
                ))}
              </SortableContext>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
