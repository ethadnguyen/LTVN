import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DiscountType } from '../enums/discount-type.enum';
import { Product } from '../../products/entities/products.entity';
import { Category } from '../../categories/entities/categories.entity';

@Entity('promotions')
export class Promotion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: DiscountType,
  })
  discount_type: DiscountType;

  @ManyToMany(() => Product)
  @JoinTable({
    name: 'promotion_products',
    joinColumn: {
      name: 'promotion_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
  })
  products: Product[];

  @ManyToMany(() => Category)
  @JoinTable({
    name: 'promotion_categories',
    joinColumn: {
      name: 'promotion_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
  })
  categories: Category[];

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  discount_value: number;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @BeforeInsert()
  @BeforeUpdate()
  validateDates() {
    if (this.end_date <= this.start_date) {
      throw new Error('End date must be after start date');
    }
  }

  @Column({
    type: 'boolean',
    default: true,
  })
  is_active: boolean;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Số lượng mã giảm giá tối đa có thể sử dụng',
  })
  usage_limit: number;

  @Column({
    type: 'int',
    default: 0,
    comment: 'Số lần đã sử dụng',
  })
  used_count: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'Giá trị đơn hàng tối thiểu để áp dụng',
  })
  minimum_order_amount: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'Giảm giá tối đa cho phép',
  })
  maximum_discount_amount: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
