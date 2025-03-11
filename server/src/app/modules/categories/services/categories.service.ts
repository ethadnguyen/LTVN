import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from '../repositories/categories.repositories';
import { CreateCategoryInput } from './types/create-category.input';
import { UpdateCategoryInput } from './types/update-category.input';
import { Category } from '../entities/categories.entity';
import { GetAllCategoryInput } from './types/get.all.category.input';
import { generateSlug } from 'src/common/helpers';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepository) {}

  async create(input: CreateCategoryInput): Promise<Category> {
    const category = new Category();
    category.name = input.name;
    category.description = input.description;
    category.icon = input.icon || null;
    category.slug = generateSlug(input.name);
    category.products_count = 0; // Khởi tạo số lượng sản phẩm là 0

    if (input.parent_id) {
      const parent = await this.categoryRepo.findById(input.parent_id);
      if (!parent) throw new NotFoundException('Parent category not found');
      category.parent = parent;
    }

    return await this.categoryRepo.create(category);
  }

  async getAllCategories(queryParams: GetAllCategoryInput) {
    const { page = 1, size = 10, is_active } = queryParams;

    const [categories, total] = await this.categoryRepo.findAll(
      {
        skip: (page - 1) * size,
        take: size,
      },
      is_active,
    );

    const totalPages = Math.ceil(total / size);

    return {
      total,
      totalPages,
      currentPage: page,
      categories,
    };
  }

  async findById(id: number): Promise<Category> {
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepo.findBySlug(slug);
    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }
    return category;
  }

  async update(id: number, input: UpdateCategoryInput): Promise<Category> {
    const categoryDB = await this.findById(id);
    if (!categoryDB) throw new NotFoundException('Category not found');

    if (input.parent_id !== undefined) {
      if (input.parent_id === null) {
        categoryDB.parent = null;
      } else {
        const parent = await this.categoryRepo.findById(input.parent_id);
        if (!parent) throw new NotFoundException('Parent category not found');
        categoryDB.parent = parent;
      }
    }

    const categoryData = {
      name: input.name,
      description: input.description,
      icon: input.icon,
      slug: input.name ? generateSlug(input.name) : undefined,
      is_active: input.is_active,
    };

    Object.assign(categoryDB, categoryData);

    return await this.categoryRepo.update(categoryDB);
  }

  async delete(id: number): Promise<void> {
    const category = await this.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    try {
      await this.categoryRepo.delete(id);
    } catch (error) {
      throw new Error(
        'Failed to delete category. Please check related records.',
      );
    }
  }

  async incrementProductCount(categoryId: number): Promise<void> {
    const category = await this.findById(categoryId);
    category.products_count += 1;
    await this.categoryRepo.update(category);

    if (category.parent) {
      await this.incrementProductCount(category.parent.id);
    }
  }

  async decrementProductCount(categoryId: number): Promise<void> {
    const category = await this.findById(categoryId);
    if (category.products_count > 0) {
      category.products_count -= 1;
      await this.categoryRepo.update(category);

      if (category.parent) {
        await this.decrementProductCount(category.parent.id);
      }
    }
  }
}
