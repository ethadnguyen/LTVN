import { Injectable } from '@nestjs/common';
import { ReviewRepository } from '../repositories/review.repositories';
import { CreateReviewInput } from './types/create-review.input';
import { Review } from '../entities/review.entity';
import { ProductRepository } from '../../products/repositories/products.repositories';
import { UserRepository } from '../../users/repositories/user.repositories';
import { UpdateReviewInput } from './types/update-review.input';
import { GetAllReviewInput } from './types/get.all.review.input';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly userRepository: UserRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async getAllReviews(queryParams: GetAllReviewInput) {
    const { page = 1, size = 10, product_id } = queryParams;

    const [reviews, total] = await this.reviewRepository.findAll(
      {
        skip: (page - 1) * size,
        take: size,
      },
      product_id,
    );

    const totalPages = Math.ceil(total / size);

    return {
      total,
      totalPages,
      currentPage: page,
      reviews,
    };
  }

  async createReview(input: CreateReviewInput, user_id: number) {
    const review = new Review();
    review.rating = input.rating;
    review.comment = input.comment;
    review.user = await this.userRepository.findById(user_id);
    review.product = await this.productRepository.findById(input.product_id);

    // Lưu review
    const savedReview = await this.reviewRepository.create(review);

    // Cập nhật rating trung bình của sản phẩm
    await this.updateProductRating(input.product_id);

    return savedReview;
  }

  async updateReview(input: UpdateReviewInput) {
    const review = await this.reviewRepository.findById(input.id);
    review.rating = input.rating;
    review.comment = input.comment;

    // Lưu review đã cập nhật
    const updatedReview = await this.reviewRepository.update(input.id, review);

    // Cập nhật rating trung bình của sản phẩm
    const productId = (await this.reviewRepository.findById(input.id)).product
      .id;
    await this.updateProductRating(productId);

    return updatedReview;
  }

  async deleteReview(id: number) {
    // Lấy thông tin sản phẩm trước khi xóa review
    const review = await this.reviewRepository.findById(id);
    const productId = review.product.id;

    // Xóa review
    await this.reviewRepository.delete(id);

    // Cập nhật rating trung bình của sản phẩm
    await this.updateProductRating(productId);

    return { success: true };
  }

  async getReviewById(id: number) {
    return this.reviewRepository.findById(id);
  }

  private async updateProductRating(productId: number): Promise<void> {
    const averageRating =
      await this.reviewRepository.calculateAverageRating(productId);

    const product = await this.productRepository.findById(productId);

    product.rating = averageRating;

    // Lưu sản phẩm đã cập nhật
    await this.productRepository.update(product);
  }
}
