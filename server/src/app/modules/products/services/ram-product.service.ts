import { Injectable, NotFoundException } from '@nestjs/common';
import { RamRepository } from '../repositories/ram.repositories';
import { ProductService } from './products.service';
import { CreateRamInput } from './types/ram_types/create-ram.input';
import { ProductType } from '../enums/product-type.enum';
import { RAM } from '../entities/ram.entity';
import { UpdateRamInput } from './types/ram_types/update-ram.input';
import { GetAllProductInput } from './types/get.all.product.input';

@Injectable()
export class RamService {
  constructor(
    private readonly ramRepo: RamRepository,
    private readonly productService: ProductService,
  ) {}
  async getAllRams(queryParams: GetAllProductInput) {
    const { page = 1, size = 10, category_id } = queryParams;

    const [rams, total] = await this.ramRepo.findAll(
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
      rams,
    };
  }

  async create(input: CreateRamInput) {
    const product = await this.productService.createProduct({
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      category_id: input.category_id,
      images: input.images,
      is_active: input.is_active,
      type: ProductType.RAM,
    });

    const ram = new RAM();
    ram.id = product.id;
    ram.ram_type = input.ram_type;
    ram.speed = input.speed;
    ram.capacity = input.capacity;
    ram.latency = input.latency;
    ram.voltage = input.voltage;
    ram.module_type = input.module_type;
    ram.ecc_support = input.ecc_support;
    ram.channel = input.channel;
    ram.timing = input.timing;
    ram.rgb = input.rgb;
    ram.heat_spreader = input.heat_spreader;

    ram.product = product;

    return await this.ramRepo.create(ram);
  }

  async update(input: UpdateRamInput) {
    const ram = await this.ramRepo.findById(input.id);
    if (!ram) {
      throw new NotFoundException(`RAM with id ${input.id} not found`);
    }

    const product = await this.productService.updateProduct({
      id: ram.id,
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      category_id: input.category_id,
      is_active: input.is_active,
      images: input.images,
      specifications: input.specifications,
    });

    const ramProperties = {
      ram_type: input.ram_type,
      speed: input.speed,
      capacity: input.capacity,
      latency: input.latency,
      voltage: input.voltage,
      module_type: input.module_type,
      ecc_support: input.ecc_support,
      channel: input.channel,
      timing: input.timing,
      rgb: input.rgb,
      heat_spreader: input.heat_spreader,
    };

    Object.assign(ram, ramProperties);
    return await this.ramRepo.update(input.id, ram);
  }

  async findById(id: number) {
    const ram = await this.ramRepo.findById(id);
    if (!ram) {
      throw new NotFoundException(`RAM with id ${id} not found`);
    }

    return ram;
  }

  async delete(id: number) {
    const ram = await this.ramRepo.findById(id);
    if (!ram) {
      throw new NotFoundException(`RAM with id ${id} not found`);
    }

    return await this.ramRepo.delete(id);
  }
}
