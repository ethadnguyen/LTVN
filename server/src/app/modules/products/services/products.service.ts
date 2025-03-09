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
import { generateSlug } from 'src/common/helpers';
import { BrandRepository } from '../../brand/repositories/brand.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly categoryRepo: CategoryRepository,
    private readonly brandRepo: BrandRepository,
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

    const brand = await this.brandRepo.findById(input.brand_id);
    if (brand) {
      product.brand = brand;
    }

    Object.assign(product, {
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      images: input.images,
      is_active: input.is_active,
      slug: generateSlug(input.name),
      type: input.type,
    });

    return await this.productRepo.create(product);
  }

  async updateProduct(input: UpdateProductInput) {
    const productDB = await this.getProductById(input.id);
    if (!productDB) {
      throw new NotFoundException(`Product with ID ${input.id} not found`);
    }

    const updateData: any = {};

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

    if (input.brand_id !== undefined) {
      if (input.brand_id === null) {
        updateData.brand = null;
        updateData.brand_id = null;
      } else {
        const brand = await this.brandRepo.findById(input.brand_id);
        if (brand) {
          updateData.brand = brand;
          updateData.brand_id = brand.id;
        }
      }
    }

    if (input.name !== undefined) {
      updateData.name = input.name;
      updateData.slug = generateSlug(input.name);
    }

    if (input.description !== undefined)
      updateData.description = input.description;
    if (input.price !== undefined) updateData.price = input.price;
    if (input.stock !== undefined) updateData.stock = input.stock;
    if (input.images !== undefined) updateData.images = input.images;
    if (input.is_active !== undefined) updateData.is_active = input.is_active;
    if (input.type !== undefined) updateData.type = input.type;

    Object.assign(productDB, updateData);

    return await this.productRepo.update(productDB);
  }

  async deleteProduct(id: number) {
    const product = await this.getProductById(id);

    if (product) {
      await this.productRepo.deleteWithRelated(product);
    }
  }
}
