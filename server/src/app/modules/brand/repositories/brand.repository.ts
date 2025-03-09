import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Brand } from '../entities/brand.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BrandRepository {
  constructor(
    @InjectRepository(Brand)
    private repo: Repository<Brand>,
  ) {}

  async create(brand: Brand): Promise<Brand> {
    return await this.repo.save(brand);
  }

  async findById(id: number): Promise<Brand> {
    return await this.repo.findOne({
      where: { id },
    });
  }

  async findBySlug(slug: string): Promise<Brand> {
    return await this.repo.findOne({
      where: { slug },
    });
  }

  async findAll(
    paginationOptions: {
      skip: number;
      take: number;
    },
    is_active?: boolean,
  ): Promise<[Brand[], number]> {
    const queryBuilder = this.repo.createQueryBuilder('brand');

    queryBuilder.orderBy('brand.created_at', 'ASC');
    queryBuilder.skip(paginationOptions.skip);
    queryBuilder.take(paginationOptions.take);

    if (is_active !== undefined) {
      queryBuilder.andWhere('brand.is_active = :is_active', { is_active });
    }

    const [brands, total] = await queryBuilder.getManyAndCount();

    return [brands, total];
  }

  async update(id: number, brand: Partial<Brand>): Promise<Brand> {
    await this.repo.update(id, brand);

    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
