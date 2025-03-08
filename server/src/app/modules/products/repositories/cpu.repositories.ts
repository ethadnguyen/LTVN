import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CPU } from '../entities/cpu.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CpuRepository {
  constructor(
    @InjectRepository(CPU)
    private readonly cpuRepo: Repository<CPU>,
  ) {}

  async create(cpu: CPU): Promise<CPU> {
    return await this.cpuRepo.save(cpu);
  }

  async findAll(
    paginationOptions: {
      skip: number;
      take: number;
    },
    category_id?: number,
  ): Promise<[CPU[], number]> {
    const queryBuilder = this.cpuRepo.createQueryBuilder('cpu');

    queryBuilder
      .leftJoinAndSelect('cpu.product', 'product')
      .leftJoinAndSelect('product.categories', 'categories');

    if (category_id) {
      queryBuilder.andWhere('categories.id = :category_id', { category_id });
    }

    queryBuilder
      .orderBy('product.created_at', 'DESC')
      .skip(paginationOptions.skip)
      .take(paginationOptions.take);

    const [cpus, total] = await queryBuilder.getManyAndCount();
    return [cpus, total];
  }

  async findById(id: number): Promise<CPU> {
    return await this.cpuRepo
      .createQueryBuilder('cpu')
      .leftJoinAndSelect('cpu.product', 'product')
      .leftJoinAndSelect('product.categories', 'categories')
      .where('cpu.id = :id', { id })
      .getOne();
  }

  async update(id: number, cpu: Partial<CPU>): Promise<CPU> {
    await this.cpuRepo.update(id, cpu);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.cpuRepo.delete(id);
  }
}
