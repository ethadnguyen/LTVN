import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PSU } from '../entities/psu.entity';

@Injectable()
export class PsuRepository {
  constructor(
    @InjectRepository(PSU)
    private readonly psuRepo: Repository<PSU>,
  ) {}

  async create(psu: PSU): Promise<PSU> {
    return await this.psuRepo.save(psu);
  }

  async findAll(
    paginationOptions: {
      skip: number;
      take: number;
    },
    category_id?: number,
  ): Promise<[PSU[], number]> {
    const queryBuilder = this.psuRepo.createQueryBuilder('psu');

    queryBuilder
      .leftJoinAndSelect('psu.product', 'product')
      .leftJoinAndSelect('product.categories', 'categories');

    if (category_id) {
      queryBuilder.andWhere('categories.id = :category_id', { category_id });
    }

    queryBuilder
      .orderBy('product.created_at', 'DESC')
      .skip(paginationOptions.skip)
      .take(paginationOptions.take);

    const [psus, total] = await queryBuilder.getManyAndCount();
    return [psus, total];
  }

  async findById(id: number): Promise<PSU> {
    return await this.psuRepo
      .createQueryBuilder('psu')
      .leftJoinAndSelect('psu.product', 'product')
      .leftJoinAndSelect('product.categories', 'categories')
      .where('psu.id = :id', { id })
      .getOne();
  }

  async update(id: number, psu: Partial<PSU>): Promise<PSU> {
    await this.psuRepo.update(id, psu);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.psuRepo.delete(id);
  }
}
