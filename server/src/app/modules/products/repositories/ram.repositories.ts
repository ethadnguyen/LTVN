import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RAM } from '../entities/ram.entity';

@Injectable()
export class RamRepository {
  constructor(
    @InjectRepository(RAM)
    private readonly ramRepo: Repository<RAM>,
  ) {}

  async create(ram: RAM): Promise<RAM> {
    return await this.ramRepo.save(ram);
  }

  async findAll(
    paginationOptions: {
      skip: number;
      take: number;
    },
    category_id?: number,
  ): Promise<[RAM[], number]> {
    const queryBuilder = this.ramRepo.createQueryBuilder('ram');

    queryBuilder
      .leftJoinAndSelect('ram.product', 'product')
      .leftJoinAndSelect('product.categories', 'categories');

    if (category_id) {
      queryBuilder.andWhere('categories.id = :category_id', { category_id });
    }

    queryBuilder
      .orderBy('product.created_at', 'DESC')
      .skip(paginationOptions.skip)
      .take(paginationOptions.take);

    const [rams, total] = await queryBuilder.getManyAndCount();

    return [rams, total];
  }

  async findById(id: number): Promise<RAM> {
    return await this.ramRepo
      .createQueryBuilder('ram')
      .leftJoinAndSelect('ram.product', 'product')
      .leftJoinAndSelect('product.categories', 'categories')
      .where('ram.id = :id', { id })
      .getOne();
  }

  async update(id: number, ram: Partial<RAM>): Promise<RAM> {
    await this.ramRepo.update(id, ram);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.ramRepo.delete(id);
  }
}
