import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/categories.entity';
import { ProductType } from '../enums/product-type.enum';
import { Brand } from '../../brand/entities/brand.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column()
  price: number;

  @Column({
    type: 'int',
    default: 0,
  })
  stock: number;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column({ nullable: true })
  slug: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  specifications: object;

  @Column({
    type: 'boolean',
    default: true,
  })
  is_active: boolean;

  @ManyToMany(() => Category)
  @JoinTable({
    name: 'product_categories',
    joinColumn: {
      name: 'product_id',
    },
    inverseJoinColumn: {
      name: 'category_id',
    },
  })
  categories: Category[];

  @ManyToOne(() => Brand)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Column({ nullable: true })
  brand_id: number;

  @Column({
    type: 'enum',
    enum: ProductType,
    nullable: true,
  })
  type: ProductType;

  @Column({
    type: 'boolean',
    default: false,
  })
  is_sale: boolean;

  @Column({
    type: 'int',
    default: 0,
  })
  sale_price: number;

  @Column({
    type: 'float',
    default: 0,
  })
  rating: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
