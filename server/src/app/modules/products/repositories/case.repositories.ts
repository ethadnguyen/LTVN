import { InjectRepository } from '@nestjs/typeorm';
import { Case } from '../entities/case.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CaseRepository {
  constructor(
    @InjectRepository(Case)
    private readonly caseRepository: Repository<Case>,
  ) {}

  async create(pcCase: Case): Promise<Case> {
    return await this.caseRepository.save(pcCase);
  }

  async findAll(
    paginationOptions: {
      skip: number;
      take: number;
    },
    category_id?: number,
  ): Promise<[Case[], number]> {
    const queryBuilder = this.caseRepository.createQueryBuilder('case');

    queryBuilder
      .leftJoinAndSelect('case.product', 'product')
      .leftJoinAndSelect('product.categories', 'categories');

    if (category_id) {
      queryBuilder.andWhere('categories.id = :category_id', { category_id });
    }

    queryBuilder
      .orderBy('product.created_at', 'DESC')
      .skip(paginationOptions.skip)
      .take(paginationOptions.take);

    const [cases, total] = await queryBuilder.getManyAndCount();
    return [cases, total];
  }

  async findById(id: number): Promise<Case> {
    return await this.caseRepository
      .createQueryBuilder('case')
      .leftJoinAndSelect('case.product', 'product')
      .leftJoinAndSelect('product.categories', 'categories')
      .where('case.id = :id', { id })
      .getOne();
  }

  async update(id: number, pcCase: Partial<Case>): Promise<Case> {
    await this.caseRepository.update(id, pcCase);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.caseRepository.delete(id);
  }
}
