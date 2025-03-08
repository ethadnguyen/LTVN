import { Injectable, NotFoundException } from '@nestjs/common';
import { GpuRepository } from '../repositories/gpu.repositories';
import { ProductService } from './products.service';
import { CreateGpuInput } from './types/gpu_types/create-gpu.input';
import { UpdateGpuInput } from './types/gpu_types/update-gpu.input';
import { ProductType } from '../enums/product-type.enum';
import { GPU } from '../entities/gpu.entity';
import { GetAllProductInput } from './types/get.all.product.input';
@Injectable()
export class GpuService {
  constructor(
    private readonly gpuRepo: GpuRepository,
    private readonly productService: ProductService,
  ) {}

  async getAllGPUs(queryParams: GetAllProductInput) {
    const { page = 1, size = 10, category_id } = queryParams;

    const [gpus, total] = await this.gpuRepo.findAll(
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
      gpus,
    };
  }

  async create(input: CreateGpuInput) {
    const product = await this.productService.createProduct({
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      category_id: input.category_id,
      type: ProductType.GPU,
    });

    const gpu = new GPU();
    gpu.id = product.id;
    gpu.chipset = input.chipset;
    gpu.memory_size = input.memory_size;
    gpu.memory_type = input.memory_type;
    gpu.core_clock = input.core_clock;
    gpu.boost_clock = input.boost_clock;
    gpu.min_psu_wattage = input.min_psu_wattage;
    gpu.power_connector = input.power_connector;
    gpu.tdp = input.tdp;
    gpu.pcie_version = input.pcie_version;
    gpu.slot_size = input.slot_size;
    gpu.cuda_cores = input.cuda_cores;
    gpu.tensor_cores = input.tensor_cores;
    gpu.display_ports = input.display_ports;
    gpu.length = input.length;

    return await this.gpuRepo.create(gpu);
  }

  async update(input: UpdateGpuInput) {
    const gpu = await this.gpuRepo.findById(input.id);
    if (!gpu) {
      throw new NotFoundException(`GPU with id ${input.id} not found`);
    }

    const product = await this.productService.updateProduct({
      id: gpu.id,
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      category_id: input.category_id,
      is_active: input.is_active,
      images: input.images,
      specifications: input.specifications,
    });

    const gpuProperties = {
      chipset: input.chipset,
      memory_size: input.memory_size,
      memory_type: input.memory_type,
      core_clock: input.core_clock,
      boost_clock: input.boost_clock,
      min_psu_wattage: input.min_psu_wattage,
      power_connector: input.power_connector,
      tdp: input.tdp,
      pcie_version: input.pcie_version,
      slot_size: input.slot_size,
      cuda_cores: input.cuda_cores,
      tensor_cores: input.tensor_cores,
      display_ports: input.display_ports,
      length: input.length,
    };

    Object.assign(gpu, gpuProperties);

    return await this.gpuRepo.update(input.id, gpu);
  }

  async findById(id: number) {
    const gpu = await this.gpuRepo.findById(id);
    if (!gpu) {
      throw new NotFoundException(`GPU with id ${id} not found`);
    }
    return gpu;
  }

  async delete(id: number) {
    const gpu = await this.gpuRepo.findById(id);
    if (!gpu) {
      throw new NotFoundException(`GPU with id ${id} not found`);
    }
    return await this.gpuRepo.delete(id);
  }
}
