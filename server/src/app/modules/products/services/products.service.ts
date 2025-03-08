import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from '../repositories/products.repositories';
import { GetAllProductInput } from './types/get.all.product.input';
import { ErrorMessage } from 'src/common/enum/error.message.enum';
import { CreateProductInput } from './types/create-product.input';
import { Product } from '../entities/products.entity';
import { UpdateProductInput } from './types/update-product.input';
import { CategoryRepository } from '../../categories/repositories/categories.repositories';
import { ProductType } from '../enums/product-type.enum';
import { DataSource } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly categoryRepo: CategoryRepository,
  ) {}

  async getAllProducts(queryParams: GetAllProductInput) {
    const { page = 1, size = 10, category_id, is_active } = queryParams;

    const [products, total] = await this.productRepo.findAll(
      {
        skip: (page - 1) * size,
        take: size,
      },
      category_id,
      is_active,
    );

    const totalPages = Math.ceil(total / size);

    return {
      total,
      totalPages,
      currentPage: page,
      products,
    };
  }

  async getProductById(id: number) {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new BadRequestException(ErrorMessage.PRODUCT_NOT_FOUND);
    }

    return product;
  }

  async getProductsByKeywords(keywords: string[]) {
    return await this.productRepo.findByKeywords(keywords);
  }

  async createProduct(input: CreateProductInput) {
    let product = new Product();

    const categories = await this.categoryRepo.findByIds(
      Array.isArray(input.category_id)
        ? input.category_id
        : [input.category_id],
    );

    if (categories.length > 0) {
      product.categories = categories;
    }

    Object.assign(product, {
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      images: input.images,
      is_active: input.is_active,
      type: input.type,
    });

    return await this.productRepo.create(product);
  }

  async updateProduct(input: UpdateProductInput) {
    const productDB = await this.getProductById(input.id);
    if (!productDB) {
      throw new NotFoundException(`Product with ID ${input.id} not found`);
    }

    if (input.category_id) {
      const categories = await this.categoryRepo.findByIds(
        Array.isArray(input.category_id)
          ? input.category_id
          : [input.category_id],
      );
      if (categories.length > 0) {
        productDB.categories = categories;
      }
    }

    Object.assign(productDB, {
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      images: input.images,
      type: input.type,
      is_active: input.is_active,
    });

    return await this.productRepo.update(productDB);
  }

  async deleteProduct(id: number) {
    const product = await this.getProductById(id);

    if (product) {
      await this.productRepo.deleteWithRelated(product);
    }
  }
}
