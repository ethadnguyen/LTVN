import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, In, DataSource } from 'typeorm';
import { Product } from '../entities/products.entity';
import { CPU } from '../entities/cpu.entity';
import { ProductType } from '../enums/product-type.enum';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  async create(product: Product): Promise<Product> {
    const savedProduct = await this.productRepo.save(product);
    return await this.productRepo.findOne({
      where: { id: savedProduct.id },
      relations: ['categories', 'brand'],
    });
  }

  async findById(id: number): Promise<Product> {
    return await this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'categories')
      .leftJoinAndSelect('product.brand', 'brand')
      .where('product.id = :id', { id })
      .getOne();
  }

  async findByKeywords(keywords: string[]): Promise<Product[]> {
    const queryBuilder = this.productRepo.createQueryBuilder('product');

    queryBuilder.leftJoinAndSelect('product.categories', 'categories');
    queryBuilder.leftJoinAndSelect('product.brand', 'brand');

    if (keywords.length > 0) {
      queryBuilder.andWhere('product.name ILIKE :keywords', {
        keywords: `%${keywords.join('%')}%`,
      });
    }

    return await queryBuilder.getMany();
  }

  async findByIds(ids: number[]): Promise<Product[]> {
    return await this.productRepo.find({
      where: { id: In(ids) },
      relations: ['categories', 'brand'],
    });
  }

  async findAll(
    paginationOptions: {
      skip: number;
      take: number;
    },
    category_id?: number,
    is_active?: boolean,
  ): Promise<[Product[], number]> {
    const queryBuilder = this.productRepo.createQueryBuilder('product');

    queryBuilder.leftJoinAndSelect('product.categories', 'categories');
    queryBuilder.leftJoinAndSelect('product.brand', 'brand');

    if (category_id) {
      queryBuilder.andWhere('categories.id = :category_id', { category_id });
    }

    if (is_active) {
      queryBuilder.andWhere('product.is_active = :is_active', { is_active });
    }

    queryBuilder
      .orderBy('product.created_at', 'DESC')
      .skip(paginationOptions.skip)
      .take(paginationOptions.take);

    const [products, total] = await queryBuilder.getManyAndCount();

    return [products, total];
  }

  async update(product: Product): Promise<Product> {
    const savedProduct = await this.productRepo.save(product);
    return await this.findById(savedProduct.id);
  }

  async delete(id: number): Promise<void> {
    await this.productRepo.delete(id);
  }

  async deleteWithRelated(product: Product): Promise<void> {
    // Xóa các bảng con trước, mỗi bảng trong một transaction riêng biệt
    // Điều này đảm bảo rằng nếu một bảng gặp lỗi, các bảng khác vẫn có thể được xóa
    const childTables = [
      'cpu',
      'gpu',
      'ram',
      'storage',
      'mainboard',
      'case',
      'psu',
      'cooling',
      // Thêm các bảng con khác nếu có
    ];

    for (const table of childTables) {
      try {
        // Mỗi bảng con được xóa trong một transaction riêng biệt
        await this.dataSource.transaction(async (manager) => {
          // Kiểm tra xem bảng có tồn tại không
          const tableExists = await manager.query(
            `SELECT EXISTS (
              SELECT 1 FROM information_schema.tables 
              WHERE table_schema = 'public' AND table_name = $1
            )`,
            [table],
          );

          if (tableExists[0].exists) {
            // Kiểm tra xem bản ghi có tồn tại trong bảng không
            const recordExists = await manager.query(
              `SELECT EXISTS (SELECT 1 FROM "${table}" WHERE id = $1)`,
              [product.id],
            );

            if (recordExists[0].exists) {
              // Xóa bản ghi trong bảng con
              await manager.query(`DELETE FROM "${table}" WHERE id = $1`, [
                product.id,
              ]);
              console.log(`Đã xóa bản ghi ${table} với id ${product.id}`);
            }
          }
        });
      } catch (error) {
        console.log(`Lỗi khi xóa bảng ${table}: ${error.message}`);
        // Không ném lỗi, tiếp tục với bảng tiếp theo
      }
    }

    // Cuối cùng, xóa bản ghi trong bảng Product trong một transaction riêng biệt
    await this.dataSource.transaction(async (manager) => {
      await manager.delete(Product, product.id);
      console.log(`Đã xóa sản phẩm với id ${product.id}`);
    });
  }

  async softDelete(id: number): Promise<void> {
    await this.productRepo.update(id, { is_active: false });
  }
}
