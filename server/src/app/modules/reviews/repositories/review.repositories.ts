import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async create(review: Review): Promise<Review> {
    return this.reviewRepository.save(review);
  }

  async findAll(
    paginationOptions: {
      take: number;
      skip: number;
    },
    product_id?: number,
  ): Promise<[Review[], number]> {
    const queryBuilder = this.reviewRepository.createQueryBuilder('review');
    if (product_id) {
      queryBuilder.where('review.product = :product_id', { product_id });
    }
    queryBuilder
      .orderBy('review.created_at', 'DESC')
      .skip(paginationOptions.skip)
      .take(paginationOptions.take);
    const [reviews, total] = await queryBuilder.getManyAndCount();
    return [reviews, total];
  }

  async findById(id: number): Promise<Review> {
    return this.reviewRepository.findOne({
      where: { id },
      relations: ['product', 'user'],
    });
  }

  async update(id: number, review: Review): Promise<Review> {
    await this.reviewRepository.update(id, review);
    return this.reviewRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.reviewRepository.delete(id);
  }
}
