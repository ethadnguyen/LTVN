import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { PaymentMethod } from '../enums/payment-method.enum';
import { PaymentStatus } from '../enums/payment-status.enum';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column()
  order_id: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.VNPAY,
  })
  payment_method: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ type: 'float' })
  amount: number;

  @Column({ nullable: true })
  transaction_id: string;

  @Column({ nullable: true })
  payment_code: string;

  @Column({ type: 'json', nullable: true })
  payment_data: Record<string, any>;

  @Column({ nullable: true })
  payment_time: Date;

  @Column({ nullable: true })
  error_code: string;

  @Column({ nullable: true })
  error_message: string;

  @Column({ nullable: true })
  retry_count: number;

  @Column({ nullable: true })
  last_retry_time: Date;

  @Column({ nullable: true })
  failure_reason: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
