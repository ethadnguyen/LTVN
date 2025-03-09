import { Injectable, NotFoundException } from '@nestjs/common';
import { CoolingRepository } from '../repositories/cooling.repositories';
import { ProductService } from './products.service';
import { CreateCoolingInput } from './types/cooling_types/create-cooling.input';
import { ProductType } from '../enums/product-type.enum';
import { Cooling } from '../entities/cooling.entity';
import { UpdateCoolingInput } from './types/cooling_types/update-cooling.input';
import { GetAllProductInput } from './types/get.all.product.input';

@Injectable()
export class CoolingService {
  constructor(
    private readonly coolingRepository: CoolingRepository,
    private readonly productService: ProductService,
  ) {}

  async create(input: CreateCoolingInput) {
    const product = await this.productService.createProduct({
      type: ProductType.COOLING,
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      category_id: input.category_id,
      images: input.images,
      is_active: input.is_active,
      brand_id: input.brand_id,
    });
    const cooling = new Cooling();
    cooling.id = product.id;
    cooling.cooling_type = input.cooling_type;
    cooling.length = input.length;
    cooling.width = input.width;
    cooling.height = input.height;
    cooling.socket_support = input.socket_support;
    cooling.fan_speed = input.fan_speed;
    cooling.noise_level = input.noise_level;
    cooling.fan_size = input.fan_size;

    return await this.coolingRepository.create(cooling);
  }

  async update(input: UpdateCoolingInput) {
    const cooling = await this.coolingRepository.findById(input.id);
    if (!cooling) {
      throw new NotFoundException('Cooling not found');
    }

    const product = await this.productService.updateProduct({
      id: cooling.id,
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      category_id: input.category_id,
      is_active: input.is_active,
      images: input.images,
      specifications: input.specifications,
    });

    const coolingProperties = {
      cooling_type: input.cooling_type,
      length: input.length,
      width: input.width,
      height: input.height,
      socket_support: input.socket_support,
      fan_speed: input.fan_speed,
      noise_level: input.noise_level,
      fan_size: input.fan_size,
    };
    Object.assign(cooling, coolingProperties);
    return await this.coolingRepository.update(input.id, cooling);
  }

  async findById(id: number) {
    const cooling = await this.coolingRepository.findById(id);
    if (!cooling) {
      throw new NotFoundException('Cooling not found');
    }
    return cooling;
  }

  async delete(id: number) {
    const cooling = await this.coolingRepository.findById(id);
    if (!cooling) {
      throw new NotFoundException('Cooling not found');
    }
    return await this.coolingRepository.delete(id);
  }

  async getAllCoolings(queryParams: GetAllProductInput) {
    const { page = 1, size = 10, category_id } = queryParams;

    const [coolings, total] = await this.coolingRepository.findAll(
      {
        skip: (page - 1) * size,
        take: size,
      },
      category_id,
    );

    const totalPages = Math.ceil(total / size);

    return {
      total,
      totalPages,
      currentPage: page,
      coolings,
    };
  }
}
