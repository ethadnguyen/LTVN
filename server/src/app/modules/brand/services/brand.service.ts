import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { BrandRepository } from '../repositories/brand.repository';
import { Brand } from '../entities/brand.entity';
import { generateSlug } from 'src/common/helpers';
import { CreateBrandInput } from './types/create-brand.input';
import { GetAllBrandInput } from './types/get.all.brand.input';
import { UpdateBrandInput } from './types/update-brand.input';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {}

  async create(input: CreateBrandInput) {
    const brand = new Brand();
    brand.name = input.name;
    brand.description = input.description;
    brand.is_active = input.is_active;
    brand.slug = generateSlug(input.name);

    return this.brandRepository.create(brand);
  }

  async getAllBrands(queryParams: GetAllBrandInput) {
    const { page = 1, size = 10, is_active } = queryParams;

    const [brands, total] = await this.brandRepository.findAll(
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
      brands,
    };
  }

  async findOne(id: number) {
    const brand = await this.brandRepository.findById(id);

    if (!brand) {
      throw new NotFoundException(`Không tìm thấy hãng sản xuất với ID ${id}`);
    }

    return brand;
  }

  async findBySlug(slug: string) {
    const brand = await this.brandRepository.findBySlug(slug);

    if (!brand) {
      throw new NotFoundException(
        `Không tìm thấy hãng sản xuất với slug ${slug}`,
      );
    }

    return brand;
  }

  async update(input: UpdateBrandInput): Promise<Brand> {
    const brand = await this.findOne(input.id);

    if (input.name && input.name !== brand.name) {
      const existingBrand = await this.brandRepository.findBySlug(
        generateSlug(input.name),
      );

      if (existingBrand && existingBrand.id !== input.id) {
        throw new ConflictException('Hãng sản xuất với tên này đã tồn tại');
      }

      brand.slug = generateSlug(input.name);
    }

    if (input.name !== undefined) brand.name = input.name;
    if (input.description !== undefined) brand.description = input.description;
    if (input.is_active !== undefined) brand.is_active = input.is_active;

    return this.brandRepository.update(input.id, brand);
  }

  async remove(id: number) {
    await this.brandRepository.delete(id);
  }
}
