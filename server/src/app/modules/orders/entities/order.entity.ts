import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '../enums/order-status.enum';
import { Address } from '../../address/entities/address.entity';
import { Promotion } from '../../promotions/entities/promotion.entity';
import { PaymentMethod } from '../enums/payment-method.enum';
import { PaymentStatus } from '../enums/payment-status.enum';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column({ type: 'float' })
  total_price: number;

  @Column({ type: 'float', nullable: true })
  original_price: number;

  @Column({ type: 'float', nullable: true, default: 0 })
  discount_amount: number;

  @Column()
  phone: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID,
  })
  payment_status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    nullable: true,
  })
  payment_method: PaymentMethod;

  @Column({nullable: true })
  paid_at: Date;

  @ManyToOne(() => Address)
  address: Address;

  @Column()
  user_id: number;

  @ManyToOne(() => Promotion, { nullable: true })
  @JoinColumn({ name: 'promotion_id' })
  promotion: Promotion;

  @Column({ nullable: true })
  promotion_id: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
  })
  order_items: OrderItem[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
