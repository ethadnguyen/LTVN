import { Injectable, NotFoundException } from '@nestjs/common';
import { CaseRepository } from '../repositories/case.repositories';
import { CreateCaseInput } from './types/case_types/create-case.input';
import { Case } from '../entities/case.entity';
import { ProductService } from './products.service';
import { ProductType } from '../enums/product-type.enum';
import { UpdateCaseInput } from './types/case_types/update-case.input';
import { GetAllProductInput } from './types/get.all.product.input';

@Injectable()
export class CaseService {
  constructor(
    private readonly caseRepository: CaseRepository,
    private readonly productService: ProductService,
  ) {}

  async create(input: CreateCaseInput) {
    const product = await this.productService.createProduct({
      type: ProductType.CASE,
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      category_id: input.category_id,
      images: input.images,
      is_active: input.is_active,
    });

    const caseEntity = new Case();
    caseEntity.id = product.id;
    caseEntity.length = input.length;
    caseEntity.width = input.width;
    caseEntity.height = input.height;
    caseEntity.color = input.color;
    caseEntity.material = input.material;
    caseEntity.psu_max_length = input.psu_max_length;
    caseEntity.cpu_cooler_height = input.cpu_cooler_height;
    caseEntity.max_gpu_length = input.max_gpu_length;
    caseEntity.form_factor = input.form_factor;

    return await this.caseRepository.create(caseEntity);
  }

  async update(input: UpdateCaseInput) {
    const caseEntity = await this.caseRepository.findById(input.id);
    if (!caseEntity) {
      throw new NotFoundException(`Case with id ${input.id} not found`);
    }

    const product = await this.productService.updateProduct({
      id: caseEntity.id,
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      category_id: input.category_id,
      is_active: input.is_active,
      images: input.images,
      specifications: input.specifications,
    });

    const caseProperties = {
      length: input.length,
      width: input.width,
      height: input.height,
      color: input.color,
      material: input.material,
      psu_max_length: input.psu_max_length,
      cpu_cooler_height: input.cpu_cooler_height,
      max_gpu_length: input.max_gpu_length,
      form_factor: input.form_factor,
    };

    Object.assign(caseEntity, caseProperties);
    return await this.caseRepository.update(input.id, caseEntity);
  }

  async findById(id: number) {
    const caseEntity = await this.caseRepository.findById(id);
    if (!caseEntity) {
      throw new NotFoundException(`Case with id ${id} not found`);
    }
    return caseEntity;
  }

  async delete(id: number) {
    const caseEntity = await this.caseRepository.findById(id);
    if (!caseEntity) {
      throw new NotFoundException(`Case with id ${id} not found`);
    }
    return await this.caseRepository.delete(id);
  }

  async getAllCases(queryParams: GetAllProductInput) {
    const { page = 1, size = 10, category_id } = queryParams;

    const [cases, total] = await this.caseRepository.findAll(
      {
        skip: (page - 1) * size,
        take: size,
      },
      category_id,
    );

    const totalPages = Math.ceil(total / size);

    return {
      total,
      totalPages,
      currentPage: page,
      cases,
    };
  }
}
