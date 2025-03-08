import { BadRequestException, Injectable } from '@nestjs/common';
import { PromotionRepository } from '../repositories/promotion.repositories';
import { ProductRepository } from '../../products/repositories/products.repositories';
import { CategoryRepository } from '../../categories/repositories/categories.repositories';
import { DiscountType } from '../enums/discount-type.enum';
import { Promotion } from '../entities/promotion.entity';
import { Product } from '../../products/entities/products.entity';
import { Repository } from 'typeorm';
import { GetAllPromotionInput } from './types/get.all.promotion.input';
import { ErrorMessage } from 'src/common/enum/error.message.enum';
import { CreatePromotionInput } from './types/create-promotion.input';
import { UpdatePromotionInput } from './types/update-promotion.input';
import { Category } from '../../categories/entities/categories.entity';

@Injectable()
export class PromotionService {
  constructor(
    private readonly promotionRepository: PromotionRepository,
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async findAllPromotions(queryParams: GetAllPromotionInput) {
    const {
      page = 1,
      size = 10,
      search,
      product_id,
      category_id,
      start_date,
      end_date,
      discount_type,
    } = queryParams;

    const [promotions, total] = await this.promotionRepository.findAll(
      { skip: (page - 1) * size, take: size },
      search,
      product_id,
      category_id,
      start_date,
      end_date,
      discount_type,
    );

    const totalPages = Math.ceil(total / size);

    return {
      total,
      totalPages,
      currentPage: page,
      promotions,
    };
  }

  async getPromotionById(id: number) {
    const promotion = await this.promotionRepository.findById(id);
    if (!promotion) {
      throw new BadRequestException(ErrorMessage.PROMOTION_NOT_FOUND);
    }

    return promotion;
  }

  async createPromotion(input: CreatePromotionInput) {
    let promotion = new Promotion();
    promotion.name = input.name;
    promotion.description = input.description;
    promotion.discount_type = input.discount_type;
    promotion.discount_value = input.discount_value;
    promotion.maximum_discount_amount = input.maximum_discount_amount;
    promotion.start_date = input.start_date;
    promotion.end_date = input.end_date;
    promotion.is_active = input.is_active;
    promotion.usage_limit = input.usage_limit;
    promotion.used_count = 0;

    if (input.product_ids) {
      const products = await this.productRepository.findByIds(
        input.product_ids,
      );
      promotion.products = products;
    }

    if (input.category_ids) {
      const categories = await this.categoryRepository.findByIds(
        input.category_ids,
      );
      promotion.categories = categories;
    }

    return await this.promotionRepository.create(promotion);
  }

  async updatePromotion(input: UpdatePromotionInput) {
    const promotion = await this.promotionRepository.findById(input.id);
    if (!promotion) {
      throw new BadRequestException(ErrorMessage.PROMOTION_NOT_FOUND);
    }

    Object.assign(promotion, {
      name: input.name,
      description: input.description,
      discount_type: input.discount_type,
      discount_value: input.discount_value,
      maximum_discount_amount: input.maximum_discount_amount,
      start_date: input.start_date,
      end_date: input.end_date,
      is_active: input.is_active,
      usage_limit: input.usage_limit,
    });

    if (input.product_ids) {
      const products = await this.productRepository.findByIds(
        input.product_ids,
      );
      promotion.products = products;
    }

    if (input.category_ids) {
      const categories = await this.categoryRepository.findByIds(
        input.category_ids,
      );
      promotion.categories = categories;
    }

    return await this.promotionRepository.update(input.id, promotion);
  }

  async calculateDiscount(
    promotionId: number,
    products: { productId: number; quantity: number }[],
  ) {
    const promotion = await this.promotionRepository.findById(promotionId);

    if (!promotion || !this.isPromotionValid(promotion)) {
      return {
        discountAmount: 0,
        applicableProducts: [],
        isValid: false,
        message: 'Khuyến mãi không hợp lệ hoặc đã hết hạn',
      };
    }

    const productDetails = await Promise.all(
      products.map(async (item) => ({
        product: await this.productRepository.findById(item.productId),
        quantity: item.quantity,
      })),
    );

    const applicableProducts = this.getApplicableProducts(
      promotion,
      productDetails,
    );
    const subtotal = this.calculateSubtotal(applicableProducts);

    if (
      promotion.minimum_order_amount &&
      subtotal < promotion.minimum_order_amount
    ) {
      return {
        discountAmount: 0,
        applicableProducts: [],
        isValid: false,
        message: 'Chưa đạt giá trị đơn hàng tối thiểu',
      };
    }

    const discountAmount = this.calculateDiscountAmount(promotion, subtotal);

    return {
      discountAmount,
      applicableProducts: applicableProducts.map((item) => item.product),
      isValid: true,
    };
  }

  async deletePromotion(id: number): Promise<void> {
    await this.promotionRepository.delete(id);
  }

  private isPromotionValid(promotion: Promotion) {
    const now = new Date();
    return (
      promotion.is_active &&
      now >= promotion.start_date &&
      now <= promotion.end_date &&
      (!promotion.usage_limit || promotion.used_count < promotion.usage_limit)
    );
  }

  private getApplicableProducts(
    promotion: Promotion,
    products: { product: Product; quantity: number }[],
  ): { product: Product; quantity: number }[] {
    return products.filter((item) => {
      const productInPromotion = promotion.products?.some(
        (p) => p.id === item.product.id,
      );
      const categoryInPromotion = promotion.categories?.some((c) =>
        item.product.categories?.some((pc) => pc.id === c.id),
      );
      return productInPromotion || categoryInPromotion;
    });
  }

  private calculateSubtotal(
    products: { product: Product; quantity: number }[],
  ): number {
    return products.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
  }

  private calculateDiscountAmount(
    promotion: Promotion,
    subtotal: number,
  ): number {
    let discountAmount = 0;

    if (promotion.discount_type === DiscountType.PERCENTAGE) {
      discountAmount = (subtotal * promotion.discount_value) / 100;
      if (promotion.maximum_discount_amount) {
        discountAmount = Math.min(
          discountAmount,
          promotion.maximum_discount_amount,
        );
      }
    } else {
      discountAmount = promotion.discount_value;
    }

    return discountAmount;
  }
}
