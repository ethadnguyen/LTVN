import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Payment } from './entities/payment.entity';
import { Order } from '../orders/entities/order.entity';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { PayosService } from './services/payos.service';
import { PaymentRepository } from './repositories/payment.repositories';
import { OrderItem } from '../orders/entities/order-item.entity';
import { OrderRepository } from '../orders/repositories/order.repositories';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Order, OrderItem]),
    ConfigModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PayosService, PaymentRepository, OrderRepository],
  exports: [PaymentService],
})
export class PaymentModule {}
