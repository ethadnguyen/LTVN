import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/categories.entity';
import { CategoryController } from './controllers/categories.controller';
import { CategoryService } from './services/categories.service';
import { CategoryRepository } from './repositories/categories.repositories';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
