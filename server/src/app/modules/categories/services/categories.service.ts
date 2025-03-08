import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from '../repositories/categories.repositories';
import { CreateCategoryInput } from './types/create-category.input';
import { UpdateCategoryInput } from './types/update-category.input';
import { Category } from '../entities/categories.entity';
import { GetAllCategoryInput } from './types/get.all.category.input';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepository) {}

  async create(input: CreateCategoryInput): Promise<Category> {
    const category = new Category();
    Object.assign(category, input);

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
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: number, input: UpdateCategoryInput): Promise<Category> {
    const existingCategory = await this.findById(id);

    try {
      if (input.parent_id) {
        const newParent = await this.categoryRepo.findById(input.parent_id);
        if (!newParent) {
          throw new NotFoundException('Parent category not found');
        }

        if (input.parent_id === id) {
          throw new Error('Category cannot be its own parent');
        }

        existingCategory.parent = newParent;
      } else if (input.parent_id === null) {
        existingCategory.parent = null;
      }

      if (input.name) existingCategory.name = input.name;
      if (input.description) existingCategory.description = input.description;
      if (typeof input.is_active !== 'undefined') {
        existingCategory.is_active = input.is_active;
      }

      return await this.categoryRepo.update(existingCategory);
    } catch (error) {
      if (error.message.includes('descendant')) {
        throw new Error('Cannot set a descendant category as parent');
      }
      throw error;
    }
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
}
