import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';
import { OrderRepository } from './repositories/order.repositories';
import { AddressModule } from '../address/address.module';
import { ProductModule } from '../products/products.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    AddressModule,
    ProductModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
  exports: [OrderService, OrderRepository],
})
export class OrderModule {}
