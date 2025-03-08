import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cooling } from '../entities/cooling.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CoolingRepository {
  constructor(
    @InjectRepository(Cooling)
    private readonly coolingRepository: Repository<Cooling>,
  ) {}

  async create(cooling: Cooling): Promise<Cooling> {
    return this.coolingRepository.save(cooling);
  }

  async findById(id: number): Promise<Cooling> {
    return this.coolingRepository
      .createQueryBuilder('cooling')
      .leftJoinAndSelect('cooling.product', 'product')
      .leftJoinAndSelect('product.categories', 'categories')
      .where('cooling.id = :id', { id })
      .getOne();
  }

  async update(id: number, cooling: Cooling): Promise<Cooling> {
    await this.coolingRepository.update(id, cooling);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.coolingRepository.delete(id);
  }

  async findAll(
    paginationOptions: {
      skip: number;
      take: number;
    },
    category_id?: number,
  ): Promise<[Cooling[], number]> {
    const queryBuilder = this.coolingRepository.createQueryBuilder('cooling');

    queryBuilder
      .leftJoinAndSelect('cooling.product', 'product')
      .leftJoinAndSelect('product.categories', 'categories');

    if (category_id) {
      queryBuilder.andWhere('categories.id = :category_id', { category_id });
    }

    queryBuilder
      .orderBy('product.created_at', 'DESC')
      .skip(paginationOptions.skip)
      .take(paginationOptions.take);

    const [coolings, total] = await queryBuilder.getManyAndCount();
    return [coolings, total];
  }
}
