import { Category } from './categories';

export type Product = {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  brand: string;
  image: string;
  description: string;
  specs: string[];
};

export const products: Product[] = [
  {
    id: 1,
    name: 'Intel Core i5-11600K',
    price: 269.99,
    categoryId: 3,
    brand: 'Intel',
    image: '/placeholder.svg?height=300&width=300',
    description: '11th Gen Intel Core i5 desktop processor.',
    specs: [
      '6 cores / 12 threads',
      'Base clock: 3.9 GHz',
      'Boost clock: up to 4.9 GHz',
      '11th generation',
    ],
  },
  {
    id: 2,
    name: 'NVIDIA GeForce RTX 3070',
    price: 499.99,
    categoryId: 6,
    brand: 'NVIDIA',
    image: '/placeholder.svg?height=300&width=300',
    description:
      'High-performance graphics card for gaming and content creation.',
    specs: [
      '8GB GDDR6',
      'Boost Clock: 1.73 GHz',
      '2nd gen Ray Tracing Cores',
      '3rd gen Tensor Cores',
    ],
  },
  {
    id: 3,
    name: 'Samsung 970 EVO Plus 1TB',
    price: 159.99,
    categoryId: 9,
    brand: 'Samsung',
    image: '/placeholder.svg?height=300&width=300',
    description: 'High-speed NVMe SSD for fast boot and load times.',
    specs: [
      'Capacity: 1TB',
      'Read Speed: up to 3,500 MB/s',
      'Write Speed: up to 3,300 MB/s',
      'NVMe interface',
    ],
  },
  {
    id: 4,
    name: 'AMD Ryzen 7 5800X',
    price: 449.99,
    categoryId: 4,
    brand: 'AMD',
    image: '/placeholder.svg?height=300&width=300',
    description: 'High-performance AMD Ryzen 7 desktop processor.',
    specs: [
      '8 cores / 16 threads',
      'Base clock: 3.8 GHz',
      'Boost clock: up to 4.7 GHz',
      '7nm process',
    ],
  },
  {
    id: 5,
    name: 'ASUS ROG Swift PG279Q',
    price: 699.99,
    categoryId: 12,
    brand: 'ASUS',
    image: '/placeholder.svg?height=300&width=300',
    description: '27-inch gaming monitor with G-Sync technology.',
    specs: [
      '27-inch IPS panel',
      '2560 x 1440 resolution',
      '165Hz refresh rate',
      'G-Sync compatible',
    ],
  },
];
