import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Storage } from '../entities/storage.entity';

@Injectable()
export class StorageRepository {
  constructor(
    @InjectRepository(Storage)
    private storageRepository: Repository<Storage>,
  ) {}

  async findAll(
    paginationOptions: {
      skip: number;
      take: number;
    },
    category_id?: number,
  ): Promise<[Storage[], number]> {
    const queryBuilder = this.storageRepository
      .createQueryBuilder('storage')
      .leftJoinAndSelect('storage.product', 'product')
      .leftJoinAndSelect('product.categories', 'categories');

    if (category_id) {
      queryBuilder.andWhere('categories.id = :category_id', { category_id });
    }

    queryBuilder
      .orderBy('product.created_at', 'DESC')
      .skip(paginationOptions.skip)
      .take(paginationOptions.take);

    const [storages, total] = await queryBuilder.getManyAndCount();
    return [storages, total];
  }

  async findById(id: number): Promise<Storage> {
    return await this.storageRepository
      .createQueryBuilder('storage')
      .leftJoinAndSelect('storage.product', 'product')
      .leftJoinAndSelect('product.categories', 'categories')
      .where('storage.id = :id', { id })
      .getOne();
  }

  async create(storage: Storage): Promise<Storage> {
    return await this.storageRepository.save(storage);
  }

  async update(id: number, storage: Storage): Promise<Storage> {
    await this.storageRepository.update(id, storage);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.storageRepository.delete(id);
  }
}
