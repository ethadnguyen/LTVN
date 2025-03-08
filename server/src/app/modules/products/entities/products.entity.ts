import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Category } from '../../categories/entities/categories.entity';
import { ProductType } from '../enums/product-type.enum';
import { Review } from '../../reviews/entities/review.entity';
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

  @Column({
    type: 'enum',
    enum: ProductType,
    nullable: true,
  })
  type: ProductType;

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
