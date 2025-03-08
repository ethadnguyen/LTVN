import { Module } from '@nestjs/common';
import { CompatibilityController } from './controllers/compatibility.controller';
import { CompatibilityService } from './services/compatibility.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CPU } from '../products/entities/cpu.entity';
import { Mainboard } from '../products/entities/mainboard.entity';
import { GPU } from '../products/entities/gpu.entity';
import { RAM } from '../products/entities/ram.entity';
import { PSU } from '../products/entities/psu.entity';
import { Case } from '../products/entities/case.entity';
import { Cooling } from '../products/entities/cooling.entity';
import { Storage } from '../products/entities/storage.entity';
import { CpuRepository } from '../products/repositories/cpu.repositories';
import { GpuRepository } from '../products/repositories/gpu.repositories';
import { MainboardRepository } from '../products/repositories/mainboard.repositories';
import { RamRepository } from '../products/repositories/ram.repositories';
import { PsuRepository } from '../products/repositories/psu.repositories';
import { CaseRepository } from '../products/repositories/case.repositories';
import { CoolingRepository } from '../products/repositories/cooling.repositories';
import { StorageRepository } from '../products/repositories/storage.repositories';
import { ProductRepository } from '../products/repositories/products.repositories';
import { Product } from '../products/entities/products.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CPU,
      GPU,
      Mainboard,
      RAM,
      PSU,
      Case,
      Cooling,
      Storage,
      Product,
    ]),
  ],
  controllers: [CompatibilityController],
  providers: [
    CompatibilityService,
    CpuRepository,
    GpuRepository,
    MainboardRepository,
    RamRepository,
    PsuRepository,
    CaseRepository,
    CoolingRepository,
    StorageRepository,
    ProductRepository,
  ],
})
export class CompatibilityModule {}
