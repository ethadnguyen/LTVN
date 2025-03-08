import { Injectable } from '@nestjs/common';
import { Mainboard } from '../entities/mainboard.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MainboardRepository {
  constructor(
    @InjectRepository(Mainboard)
    private readonly mainboardRepo: Repository<Mainboard>,
  ) {}

  async create(mainboard: Mainboard): Promise<Mainboard> {
    return await this.mainboardRepo.save(mainboard);
  }

  async findAll(
    paginationOptions: {
      skip: number;
      take: number;
    },
    category_id?: number,
  ): Promise<[Mainboard[], number]> {
    const queryBuilder = this.mainboardRepo.createQueryBuilder('mainboard');

    queryBuilder
      .leftJoinAndSelect('mainboard.product', 'product')
      .leftJoinAndSelect('product.categories', 'categories');

    if (category_id) {
      queryBuilder.andWhere('categories.id = :category_id', { category_id });
    }

    queryBuilder
      .orderBy('product.created_at', 'DESC')
      .skip(paginationOptions.skip)
      .take(paginationOptions.take);

    const [mainboards, total] = await queryBuilder.getManyAndCount();
    return [mainboards, total];
  }

  async findById(id: number): Promise<Mainboard> {
    return await this.mainboardRepo
      .createQueryBuilder('mainboard')
      .leftJoinAndSelect('mainboard.product', 'product')
      .leftJoinAndSelect('product.categories', 'categories')
      .where('mainboard.id = :id', { id })
      .getOne();
  }

  async update(id: number, mainboard: Partial<Mainboard>): Promise<Mainboard> {
    await this.mainboardRepo.update(id, mainboard);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.mainboardRepo.delete(id);
  }
}
