import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { PaymentRepository } from './repositories/payment.repositories';
import { Payment } from './entities/payment.entity';
import { Order } from '../orders/entities/order.entity';
import vnpayConfig from '../../../config/vnpay/vnpay.config';
import { OrderRepository } from '../orders/repositories/order.repositories';
import { OrderItem } from '../orders/entities/order-item.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Order, OrderItem]),
    ConfigModule.forFeature(vnpayConfig),
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentRepository,
    OrderRepository,
    ConfigService,
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
