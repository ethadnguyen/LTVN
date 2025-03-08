import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GPU } from '../entities/gpu.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GpuRepository {
  constructor(
    @InjectRepository(GPU)
    private readonly gpuRepo: Repository<GPU>,
  ) {}

  async create(gpu: GPU): Promise<GPU> {
    return await this.gpuRepo.save(gpu);
  }

  async findAll(
    paginationOptions: {
      skip: number;
      take: number;
    },
    category_id?: number,
  ): Promise<[GPU[], number]> {
    const queryBuilder = this.gpuRepo.createQueryBuilder('gpu');

    queryBuilder
      .leftJoinAndSelect('gpu.product', 'product')
      .leftJoinAndSelect('product.categories', 'categories');

    if (category_id) {
      queryBuilder.andWhere('categories.id = :category_id', { category_id });
    }

    queryBuilder
      .orderBy('product.created_at', 'DESC')
      .skip(paginationOptions.skip)
      .take(paginationOptions.take);

    const [gpus, total] = await queryBuilder.getManyAndCount();
    return [gpus, total];
  }

  async findById(id: number): Promise<GPU> {
    return await this.gpuRepo
      .createQueryBuilder('gpu')
      .leftJoinAndSelect('gpu.product', 'product')
      .leftJoinAndSelect('product.categories', 'categories')
      .where('gpu.id = :id', { id })
      .getOne();
  }

  async update(id: number, gpu: Partial<GPU>): Promise<GPU> {
    await this.gpuRepo.update(id, gpu);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.gpuRepo.delete(id);
  }
}
