import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Address } from './entities/address.entity';
import { AddressController } from './controllers/address.controller';
import { AddressService } from './services/address.service';
import { AddressRepository } from './repositories/address.repositories';
import { GoongService } from './services/goong.service';
import goongConfig from '../../../config/goong/goong.config';
import { UserRepository } from '../users/repositories/user.repositories';
import { OrderRepository } from '../orders/repositories/order.repositories';
import { User } from '../users/entities/user.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Address, User, Order, OrderItem]),
    ConfigModule.forFeature(goongConfig),
  ],
  controllers: [AddressController],
  providers: [
    AddressService,
    AddressRepository,
    GoongService,
    UserRepository,
    OrderRepository,
  ],
  exports: [AddressService],
})
export class AddressModule {}
