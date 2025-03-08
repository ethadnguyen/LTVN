import { Injectable, NotFoundException } from '@nestjs/common';
import { StorageRepository } from '../repositories/storage.repositories';
import { ProductService } from './products.service';
import { CreateStorageInput } from './types/storage_types/create-storage.input';
import { ProductType } from '../enums/product-type.enum';
import { UpdateStorageInput } from './types/storage_types/update-storage.input';
import { Storage } from '../entities/storage.entity';
import { GetAllProductInput } from './types/get.all.product.input';

@Injectable()
export class StorageService {
  constructor(
    private readonly storageRepo: StorageRepository,
    private readonly productService: ProductService,
  ) {}

  async getAllStorages(queryParams: GetAllProductInput) {
    const { page = 1, size = 10, category_id } = queryParams;

    const [storages, total] = await this.storageRepo.findAll(
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
      storages,
    };
  }

  async create(input: CreateStorageInput): Promise<Storage> {
    const product = await this.productService.createProduct({
      type: ProductType.STORAGE,
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      category_id: input.category_id,
      images: input.images,
      is_active: input.is_active,
    });
    const storage = new Storage();
    storage.product = product;
    storage.storage_type = input.storage_type;
    storage.capacity = input.capacity;
    storage.read_speed = input.read_speed;
    storage.write_speed = input.write_speed;
    storage.form_factor = input.form_factor;
    storage.cache = input.cache;
    return this.storageRepo.create(storage);
  }

  async update(input: UpdateStorageInput) {
    const storage = await this.storageRepo.findById(input.id);
    if (!storage) {
      throw new NotFoundException(`Storage with id ${input.id} not found`);
    }
    const product = await this.productService.updateProduct({
      id: storage.id,
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      category_id: input.category_id,
      is_active: input.is_active,
      images: input.images,
      specifications: input.specifications,
    });

    const storageProperties = {
      storage_type: input.storage_type,
      capacity: input.capacity,
      read_speed: input.read_speed,
      write_speed: input.write_speed,
      form_factor: input.form_factor,
      cache: input.cache,
    };

    Object.assign(storage, storageProperties);
    return await this.storageRepo.update(input.id, storage);
  }

  async findById(id: number) {
    const storage = await this.storageRepo.findById(id);
    if (!storage) {
      throw new NotFoundException(`Storage with id ${id} not found`);
    }
    return storage;
  }

  async delete(id: number) {
    const storage = await this.storageRepo.findById(id);
    if (!storage) {
      throw new NotFoundException(`Storage with id ${id} not found`);
    }
    return await this.storageRepo.delete(id);
  }
}
