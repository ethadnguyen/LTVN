import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';
import { OrderRepository } from './repositories/order.repositories';
import { AddressModule } from '../address/address.module';
import { ProductModule } from '../products/products.module';
import { PromotionModule } from '../promotions/promotion.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    AddressModule,
    ProductModule,
    PromotionModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, JwtService],
  exports: [OrderService, OrderRepository],
})
export class OrderModule {}
