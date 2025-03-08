import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotion } from './entities/promotion.entity';
import { PromotionService } from './services/promotion.service';
import { PromotionRepository } from './repositories/promotion.repositories';
import { ProductModule } from '../products/products.module';
import { CategoryModule } from '../categories/categories.module';
import { PromotionController } from './controllers/promotion.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Promotion]),
    ProductModule,
    CategoryModule,
  ],
  controllers: [PromotionController],
  providers: [PromotionRepository, PromotionService],
  exports: [PromotionRepository, PromotionService],
})
export class PromotionModule {}
