import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Promotion } from '../entities/promotion.entity';
import { Repository } from 'typeorm';
import { DiscountType } from '../enums/discount-type.enum';

@Injectable()
export class PromotionRepository {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
  ) {}

  async findAll(
    paginationOptions: {
      skip: number;
      take: number;
    },
    search?: string,
    product_id?: number,
    category_id?: number,
    start_date?: Date,
    end_date?: Date,
    discount_type?: DiscountType,
  ): Promise<[Promotion[], number]> {
    const queryBuilder =
      this.promotionRepository.createQueryBuilder('promotion');

    queryBuilder.leftJoinAndSelect('promotion.products', 'products');
    queryBuilder.leftJoinAndSelect('promotion.categories', 'categories');

    if (search) {
      queryBuilder.andWhere('promotion.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    if (product_id) {
      queryBuilder.andWhere('products.id = :product_id', { product_id });
    }

    if (category_id) {
      queryBuilder.andWhere('categories.id = :category_id', { category_id });
    }

    if (start_date) {
      queryBuilder.andWhere('promotion.start_date >= :start_date', {
        start_date,
      });
    }

    if (end_date) {
      queryBuilder.andWhere('promotion.end_date <= :end_date', { end_date });
    }

    if (discount_type) {
      queryBuilder.andWhere('promotion.discount_type = :discount_type', {
        discount_type,
      });
    }

    queryBuilder
      .orderBy('promotion.created_at', 'DESC')
      .skip(paginationOptions.skip)
      .take(paginationOptions.take);

    const [promotions, total] = await queryBuilder.getManyAndCount();

    return [promotions, total];
  }

  async findById(id: number): Promise<Promotion> {
    const promotion = await this.promotionRepository.findOne({
      where: { id },
      relations: ['products', 'categories'],
    });

    return promotion;
  }

  async create(promotion: Promotion): Promise<Promotion> {
    const savedPromotion = await this.promotionRepository.save(promotion);
    return await this.findById(savedPromotion.id);
  }

  async update(id: number, promotion: Partial<Promotion>): Promise<Promotion> {
    const updateData = { ...promotion };
    delete updateData.products;
    delete updateData.categories;

    await this.promotionRepository.update(id, updateData);
    return await this.findById(id);
  }

  async save(promotion: Promotion): Promise<Promotion> {
    return await this.promotionRepository.save(promotion);
  }

  async delete(id: number): Promise<void> {
    await this.promotionRepository.delete(id);
  }
}
