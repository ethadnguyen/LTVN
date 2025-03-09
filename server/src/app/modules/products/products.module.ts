import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/products.entity';
import { ProductController } from './controllers/products.controller';
import { ProductService } from './services/products.service';
import { ProductRepository } from './repositories/products.repositories';
import { CategoryModule } from '../categories/categories.module';
import { CPU } from './entities/cpu.entity';
import { CpuController } from './controllers/cpu.controller';
import { CpuRepository } from './repositories/cpu.repositories';
import { PsuController } from './controllers/psu.controller';
import { PSU } from './entities/psu.entity';
import { PsuService } from './services/psu-product.service';
import { PsuRepository } from './repositories/psu.repositories';
import { GPU } from './entities/gpu.entity';
import { GpuService } from './services/gpu-product.service';
import { GpuRepository } from './repositories/gpu.repositories';
import { GpuController } from './controllers/gpu.controller';
import { RAM } from './entities/ram.entity';
import { RamController } from './controllers/ram.controller';
import { CpuService } from './services/cpu-product.service';
import { RamService } from './services/ram-product.service';
import { RamRepository } from './repositories/ram.repositories';
import { Mainboard } from './entities/mainboard.entity';
import { MainboardController } from './controllers/mainboard.controller';
import { MainboardService } from './services/mainboard-product.service';
import { MainboardRepository } from './repositories/mainboard.repositories';
import { Storage } from './entities/storage.entity';
import { StorageController } from './controllers/storage.controller';
import { StorageService } from './services/storage-product.service';
import { StorageRepository } from './repositories/storage.repositories';
import { Case } from './entities/case.entity';
import { CaseController } from './controllers/case.controller';
import { CaseService } from './services/case-product.service';
import { CaseRepository } from './repositories/case.repositories';
import { Cooling } from './entities/cooling.entity';
import { CoolingController } from './controllers/cooling.controller';
import { CoolingService } from './services/cooling-product.service';
import { CoolingRepository } from './repositories/cooling.repositories';
import { BrandModule } from '../brand/brand.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      CPU,
      PSU,
      GPU,
      RAM,
      Mainboard,
      Storage,
      Case,
      Cooling,
    ]),
    CategoryModule,
    BrandModule,
  ],
  controllers: [
    ProductController,
    CpuController,
    PsuController,
    GpuController,
    RamController,
    MainboardController,
    StorageController,
    CaseController,
    CoolingController,
  ],
  providers: [
    ProductService,
    ProductRepository,
    CpuService,
    CpuRepository,
    PsuService,
    PsuRepository,
    GpuService,
    GpuRepository,
    RamService,
    RamRepository,
    MainboardService,
    MainboardRepository,
    StorageService,
    StorageRepository,
    CaseService,
    CaseRepository,
    CoolingService,
    CoolingRepository,
  ],
  exports: [ProductService, ProductRepository],
})
export class ProductModule {}
