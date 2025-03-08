import { Injectable, NotFoundException } from '@nestjs/common';
import { PsuRepository } from '../repositories/psu.repositories';
import { ProductService } from './products.service';
import { CreatePsuInput } from './types/psu_types/create-psu.input';
import { UpdatePsuInput } from './types/psu_types/update-psu.input';
import { ProductType } from '../enums/product-type.enum';
import { PSU } from '../entities/psu.entity';
import { GetAllProductInput } from './types/get.all.product.input';

@Injectable()
export class PsuService {
  constructor(
    private readonly psuRepo: PsuRepository,
    private readonly productService: ProductService,
  ) {}

  async getAllPsus(queryParams: GetAllProductInput) {
    const { page = 1, size = 10, category_id } = queryParams;

    const [psus, total] = await this.psuRepo.findAll(
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
      psus,
    };
  }

  async create(input: CreatePsuInput) {
    const product = await this.productService.createProduct({
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      category_id: input.category_id,
      images: input.images,
      is_active: input.is_active,
      type: ProductType.POWER_SUPPLY,
    });

    const psu = new PSU();
    psu.id = product.id;
    psu.wattage = input.wattage;
    psu.efficiency_rating = input.efficiency_rating;
    psu.form_factor = input.form_factor;
    psu.modular = input.modular;
    psu.input_voltage = input.input_voltage;
    psu.fan_size = input.fan_size;
    psu.fan_speed = input.fan_speed;
    psu.noise_level = input.noise_level;
    psu.fan_bearing = input.fan_bearing;
    psu.rgb = input.rgb;
    psu.atx12v_version = input.atx12v_version;
    psu.protection_features = input.protection_features;
    psu.pcie_connectors = input.pcie_connectors;
    psu.sata_connectors = input.sata_connectors;
    psu.eps_connectors = input.eps_connectors;
    psu.product = product;

    return await this.psuRepo.create(psu);
  }

  async update(input: UpdatePsuInput) {
    const psu = await this.psuRepo.findById(input.id);
    if (!psu) {
      throw new NotFoundException(`PSU with id ${input.id} not found`);
    }

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

    const psuProperties = {
      wattage: input.wattage,
      efficiency_rating: input.efficiency_rating,
      form_factor: input.form_factor,
      modular: input.modular,
      input_voltage: input.input_voltage,
      fan_size: input.fan_size,
      fan_speed: input.fan_speed,
      noise_level: input.noise_level,
      fan_bearing: input.fan_bearing,
      rgb: input.rgb,
      atx12v_version: input.atx12v_version,
      protection_features: input.protection_features,
      pcie_connectors: input.pcie_connectors,
      sata_connectors: input.sata_connectors,
      eps_connectors: input.eps_connectors,
    };

    Object.assign(psu, psuProperties);
    return await this.psuRepo.update(input.id, psu);
  }

  async findById(id: number) {
    const psu = await this.psuRepo.findById(id);
    if (!psu) {
      throw new NotFoundException(`PSU with id ${id} not found`);
    }
    return psu;
  }

  async delete(id: number) {
    const psu = await this.psuRepo.findById(id);
    if (!psu) {
      throw new NotFoundException(`PSU with id ${id} not found`);
    }
    return await this.psuRepo.delete(id);
  }
}
