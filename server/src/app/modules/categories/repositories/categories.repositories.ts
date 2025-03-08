import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository, In } from 'typeorm';
import { Category } from '../entities/categories.entity';

@Injectable()
export class CategoryRepository {
  private treeRepository: TreeRepository<Category>;

  constructor(
    @InjectRepository(Category)
    private repo: Repository<Category>,
  ) {
    this.treeRepository = repo.manager.getTreeRepository(Category);
  }

  async create(category: Category): Promise<Category> {
    return await this.repo.save(category);
  }

  async findById(id: number): Promise<Category> {
    return await this.repo.findOne({
      where: { id },
      relations: ['children', 'parent'],
    });
  }

  async findByIds(ids: number[]): Promise<Category[]> {
    return await this.repo.find({
      where: { id: In(ids) },
      relations: ['children', 'parent'],
    });
  }

  async findAll(
    paginationOptions: {
      skip: number;
      take: number;
    },
    is_active?: boolean,
  ): Promise<[Category[], number]> {
    const [categories, total] = await this.repo.findAndCount({
      skip: paginationOptions.skip,
      take: paginationOptions.take,
      relations: ['children', 'parent'],
      order: {
        id: 'ASC',
      },
      where: { is_active },
    });
    return [categories, total];
  }

  async getCategoryByParentId(parentId: number) {
    const parent = await this.findById(parentId);
    if (!parent) return [];
    return await this.repo.manager
      .getTreeRepository(Category)
      .findDescendants(parent);
  }

  async update(category: Category): Promise<Category> {
    if (category.parent) {
      const descendants = await this.treeRepository.findDescendants(category);
      if (descendants.some((desc) => desc.id === category.parent.id)) {
        throw new Error('Cannot set a descendant as parent');
      }
    }

    return await this.repo.save(category);
  }

  async delete(id: number): Promise<void> {
    const category = await this.findById(id);
    if (!category) return;

    const descendants = await this.treeRepository.findDescendants(category);

    for (const desc of descendants.reverse()) {
      await this.repo.remove(desc);
    }
  }
}
