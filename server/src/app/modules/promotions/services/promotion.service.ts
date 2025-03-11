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
    promotion.minimum_order_amount = input.minimum_order_amount;
    promotion.start_date = input.start_date;
    promotion.end_date = input.end_date;
    promotion.is_active = input.is_active;
    promotion.usage_limit = input.usage_limit;
    promotion.used_count = 0;

    let products: Product[] = [];
    if (input.product_ids) {
      products = await this.productRepository.findByIds(input.product_ids);
      promotion.products = products;

      // Cập nhật trạng thái giảm giá cho sản phẩm
      await this.updateProductSaleStatus(products, promotion);
    }

    if (input.category_ids) {
      const categories = await this.categoryRepository.findByIds(
        input.category_ids,
      );
      promotion.categories = categories;

      // Nếu có danh mục, lấy tất cả sản phẩm thuộc danh mục đó và cập nhật
      if (categories.length > 0) {
        const productsInCategories =
          await this.productRepository.findByCategories(
            categories.map((cat) => cat.id),
          );
        // Loại bỏ các sản phẩm đã được thêm trực tiếp để tránh trùng lặp
        const uniqueProducts = productsInCategories.filter(
          (p) => !products.some((existingP) => existingP.id === p.id),
        );
        await this.updateProductSaleStatus(
          [...products, ...uniqueProducts],
          promotion,
        );
      }
    }

    return await this.promotionRepository.create(promotion);
  }

  async updatePromotion(input: UpdatePromotionInput) {
    const promotion = await this.promotionRepository.findById(input.id);
    if (!promotion) {
      throw new BadRequestException(ErrorMessage.PROMOTION_NOT_FOUND);
    }

    // Lưu lại danh sách sản phẩm và danh mục cũ để reset trạng thái giảm giá
    const oldProducts = [...(promotion.products || [])];
    const oldCategories = [...(promotion.categories || [])];

    Object.assign(promotion, {
      name: input.name,
      description: input.description,
      discount_type: input.discount_type,
      discount_value: input.discount_value,
      maximum_discount_amount: input.maximum_discount_amount,
      minimum_order_amount: input.minimum_order_amount,
      start_date: input.start_date,
      end_date: input.end_date,
      is_active: input.is_active,
      usage_limit: input.usage_limit,
      used_count: input.used_count,
    });

    let newProducts: Product[] = [];
    if (input.product_ids) {
      newProducts = await this.productRepository.findByIds(input.product_ids);
      promotion.products = newProducts;
    }

    let newCategories: Category[] = [];
    if (input.category_ids) {
      newCategories = await this.categoryRepository.findByIds(
        input.category_ids,
      );
      promotion.categories = newCategories;
    }

    // Sử dụng save thay vì update để cập nhật cả mối quan hệ
    const updatedPromotion = await this.promotionRepository.save(promotion);

    // Reset trạng thái giảm giá cho các sản phẩm cũ không còn trong promotion
    await this.resetProductSaleStatus(
      oldProducts,
      oldCategories,
      newProducts,
      newCategories,
    );

    // Cập nhật trạng thái giảm giá cho các sản phẩm mới
    await this.updateProductSaleStatus(newProducts, promotion);

    // Nếu có danh mục, cập nhật tất cả sản phẩm thuộc danh mục đó
    if (newCategories.length > 0) {
      const productsInCategories =
        await this.productRepository.findByCategories(
          newCategories.map((cat) => cat.id),
        );
      // Loại bỏ các sản phẩm đã được thêm trực tiếp để tránh trùng lặp
      const uniqueProducts = productsInCategories.filter(
        (p) => !newProducts.some((existingP) => existingP.id === p.id),
      );
      await this.updateProductSaleStatus(uniqueProducts, promotion);
    }

    return updatedPromotion;
  }

  async calculateDiscount(
    promotionId: number,
    products: { productId: number; quantity: number }[],
    incrementUsage: boolean = false,
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

    if (incrementUsage && discountAmount > 0) {
      await this.incrementUsedCount(promotionId);
    }

    return {
      discountAmount,
      applicableProducts: applicableProducts.map((item) => item.product),
      isValid: true,
    };
  }

  async deletePromotion(id: number): Promise<void> {
    const promotion = await this.promotionRepository.findById(id);
    if (promotion) {
      // Reset trạng thái giảm giá cho tất cả sản phẩm trong promotion
      const products = [...(promotion.products || [])];

      // Lấy tất cả sản phẩm thuộc danh mục trong promotion
      if (promotion.categories && promotion.categories.length > 0) {
        const productsInCategories =
          await this.productRepository.findByCategories(
            promotion.categories.map((cat) => cat.id),
          );
        // Loại bỏ các sản phẩm đã được thêm trực tiếp để tránh trùng lặp
        const uniqueProducts = productsInCategories.filter(
          (p) => !products.some((existingP) => existingP.id === p.id),
        );
        products.push(...uniqueProducts);
      }

      // Reset trạng thái giảm giá
      for (const product of products) {
        product.is_sale = false;
        product.sale_price = 0;
        await this.productRepository.update(product);
      }
    }

    await this.promotionRepository.delete(id);
  }

  private isPromotionValid(promotion: Promotion) {
    const now = new Date();
    return (
      promotion.is_active &&
      now >= new Date(promotion.start_date) &&
      now <= new Date(promotion.end_date) &&
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

  private async updateProductSaleStatus(
    products: Product[],
    promotion: Promotion,
  ): Promise<void> {
    if (!products || products.length === 0 || !promotion.is_active) {
      return;
    }

    const now = new Date();
    // Chỉ cập nhật nếu promotion đang hoạt động và trong thời gian hiệu lực
    if (
      promotion.is_active &&
      now >= new Date(promotion.start_date) &&
      now <= new Date(promotion.end_date)
    ) {
      for (const product of products) {
        // Tính toán giá sau khi giảm
        let salePrice = product.price;

        if (promotion.discount_type === DiscountType.PERCENTAGE) {
          salePrice =
            product.price - (product.price * promotion.discount_value) / 100;
          // Áp dụng giới hạn giảm giá tối đa nếu có
          if (
            promotion.maximum_discount_amount &&
            product.price - salePrice > promotion.maximum_discount_amount
          ) {
            salePrice = product.price - promotion.maximum_discount_amount;
          }
        } else if (promotion.discount_type === DiscountType.FIXED) {
          salePrice = product.price - promotion.discount_value;
          if (salePrice < 0) salePrice = 0;
        }

        // Làm tròn giá
        salePrice = Math.round(salePrice);

        // Cập nhật sản phẩm
        product.is_sale = true;
        product.sale_price = salePrice;
        await this.productRepository.update(product);
      }
    }
  }

  // Phương thức mới để reset trạng thái giảm giá cho sản phẩm
  private async resetProductSaleStatus(
    oldProducts: Product[],
    oldCategories: Category[],
    newProducts: Product[],
    newCategories: Category[],
  ): Promise<void> {
    // Tìm các sản phẩm đã bị loại khỏi promotion
    const removedProducts = oldProducts.filter(
      (oldP) => !newProducts.some((newP) => newP.id === oldP.id),
    );

    // Tìm các danh mục đã bị loại khỏi promotion
    const removedCategories = oldCategories.filter(
      (oldC) => !newCategories.some((newC) => newC.id === oldC.id),
    );

    // Reset trạng thái giảm giá cho các sản phẩm bị loại trực tiếp
    for (const product of removedProducts) {
      product.is_sale = false;
      product.sale_price = 0;
      await this.productRepository.update(product);
    }

    // Reset trạng thái giảm giá cho các sản phẩm thuộc danh mục bị loại
    if (removedCategories.length > 0) {
      const productsInRemovedCategories =
        await this.productRepository.findByCategories(
          removedCategories.map((cat) => cat.id),
        );

      // Loại bỏ các sản phẩm vẫn còn trong promotion
      const uniqueProducts = productsInRemovedCategories.filter(
        (p) => !newProducts.some((newP) => newP.id === p.id),
      );

      for (const product of uniqueProducts) {
        product.is_sale = false;
        product.sale_price = 0;
        await this.productRepository.update(product);
      }
    }
  }

  async incrementUsedCount(promotionId: number): Promise<Promotion> {
    const promotion = await this.promotionRepository.findById(promotionId);

    if (!promotion) {
      throw new BadRequestException(ErrorMessage.PROMOTION_NOT_FOUND);
    }

    // Kiểm tra xem khuyến mãi có còn hiệu lực không
    if (!this.isPromotionValid(promotion)) {
      throw new BadRequestException('Khuyến mãi không hợp lệ hoặc đã hết hạn');
    }

    // Tăng số lần sử dụng
    promotion.used_count += 1;

    // Nếu đạt đến giới hạn sử dụng, có thể tự động vô hiệu hóa khuyến mãi
    if (
      promotion.usage_limit &&
      promotion.used_count >= promotion.usage_limit
    ) {
      promotion.is_active = false;
    }

    // Lưu lại thay đổi
    return await this.promotionRepository.save(promotion);
  }
}
