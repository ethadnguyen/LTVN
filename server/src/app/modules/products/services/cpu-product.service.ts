import { Injectable, NotFoundException } from '@nestjs/common';
import { CPU } from '../entities/cpu.entity';
import { CreateCpuInput } from './types/cpu_types/create-cpu.input';
import { CpuRepository } from '../repositories/cpu.repositories';
import { UpdateCpuInput } from './types/cpu_types/update-cpu.input';
import { ProductService } from './products.service';
import { ProductType } from '../enums/product-type.enum';
import { GetAllProductInput } from './types/get.all.product.input';

@Injectable()
export class CpuService {
  constructor(
    private readonly cpuRepo: CpuRepository,
    private readonly productService: ProductService,
  ) {}

  async getAllCPUs(queryParams: GetAllProductInput) {
    const { page = 1, size = 10, category_id } = queryParams;

    const [cpus, total] = await this.cpuRepo.findAll(
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
      cpus,
    };
  }

  async create(input: CreateCpuInput) {
    const product = await this.productService.createProduct({
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      category_id: input.category_id,
      images: input.images,
      is_active: input.is_active,
      type: ProductType.CPU,
    });

    // Sau đó tạo CPU với id từ product
    const cpu = new CPU();
    cpu.id = product.id;
    cpu.socket_type = input.socket_type;
    cpu.cores = input.cores;
    cpu.threads = input.threads;
    cpu.base_clock = input.base_clock;
    cpu.boost_clock = input.boost_clock;
    cpu.wattage = input.wattage;
    cpu.cache = input.cache;
    cpu.tdp = input.tdp;
    cpu.pcie_version = input.pcie_version;
    cpu.pcie_slots = input.pcie_slots;
    cpu.max_memory_capacity = input.max_memory_capacity;
    cpu.supported_ram = input.supported_ram;
    cpu.supported_chipsets = input.supported_chipsets;
    cpu.has_integrated_gpu = input.has_integrated_gpu;
    cpu.product = product;

    return await this.cpuRepo.create(cpu);
  }

  async update(input: UpdateCpuInput) {
    const cpu = await this.cpuRepo.findById(input.id);
    if (!cpu) {
      throw new NotFoundException(`CPU with id ${input.id} not found`);
    }

    // Cập nhật thông tin product trước
    await this.productService.updateProduct({
      id: input.id,
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      category_id: input.category_id,
      images: input.images,
      is_active: input.is_active,
      specifications: input.specifications,
    });

    // Chỉ cập nhật các thuộc tính của CPU
    const cpuProperties = {
      socket_type: input.socket_type,
      cores: input.cores,
      threads: input.threads,
      base_clock: input.base_clock,
      boost_clock: input.boost_clock,
      wattage: input.wattage,
      cache: input.cache,
      tdp: input.tdp,
      pcie_version: input.pcie_version,
      pcie_slots: input.pcie_slots,
      max_memory_capacity: input.max_memory_capacity,
      supported_ram: input.supported_ram,
      supported_chipsets: input.supported_chipsets,
      has_integrated_gpu: input.has_integrated_gpu,
    };

    Object.assign(cpu, cpuProperties);
    return await this.cpuRepo.update(input.id, cpu);
  }

  async findById(id: number) {
    const cpu = await this.cpuRepo.findById(id);
    if (!cpu) {
      throw new NotFoundException(`CPU with id ${id} not found`);
    }
    return cpu;
  }

  async delete(id: number) {
    const cpu = await this.cpuRepo.findById(id);
    if (!cpu) {
      throw new NotFoundException(`CPU with id ${id} not found`);
    }
    return await this.cpuRepo.delete(id);
  }
}
