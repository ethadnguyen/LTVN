import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, In, DataSource } from 'typeorm';
import { Product } from '../entities/products.entity';

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

  async findBySlug(slug: string): Promise<Product> {
    return await this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'categories')
      .leftJoinAndSelect('product.brand', 'brand')
      .where('product.slug = :slug', { slug })
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
    search?: string,
    min_price?: number,
    max_price?: number,
    is_sale?: boolean,
    min_rating?: number,
    brands?: string[],
  ): Promise<[Product[], number]> {
    const queryBuilder = this.productRepo.createQueryBuilder('product');

    queryBuilder.leftJoinAndSelect('product.categories', 'categories');
    queryBuilder.leftJoinAndSelect('product.brand', 'brand');

    if (category_id) {
      queryBuilder.andWhere('categories.id = :category_id', { category_id });
    }

    if (is_active !== undefined) {
      queryBuilder.andWhere('product.is_active = :is_active', { is_active });
    }

    // Áp dụng filter search
    if (search) {
      queryBuilder.andWhere('product.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    // Áp dụng filter giá
    if (min_price !== undefined) {
      console.log('Applying min_price filter:', min_price);
      queryBuilder.andWhere('product.price >= :min_price', { min_price });
    }

    if (max_price !== undefined) {
      console.log('Applying max_price filter:', max_price);
      queryBuilder.andWhere('product.price <= :max_price', { max_price });
    }

    // Áp dụng filter is_sale
    if (is_sale !== undefined) {
      queryBuilder.andWhere('product.is_sale = :is_sale', { is_sale });
    }

    // Áp dụng filter min_rating
    if (min_rating !== undefined) {
      queryBuilder.andWhere('product.rating >= :min_rating', { min_rating });
    }

    // Áp dụng filter brands
    if (brands && brands.length > 0) {
      queryBuilder.andWhere('brand.name IN (:...brands)', { brands });
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

  async findByCategories(categoryIds: number[]): Promise<Product[]> {
    if (!categoryIds || categoryIds.length === 0) {
      return [];
    }

    const queryBuilder = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'categories')
      .leftJoinAndSelect('product.brand', 'brand')
      .where('categories.id IN (:...categoryIds)', { categoryIds });

    return await queryBuilder.getMany();
  }

  async findByCategorySlug(
    slug: string,
    paginationOptions: {
      skip: number;
      take: number;
    },
    is_active?: boolean,
    search?: string,
    min_price?: number,
    max_price?: number,
    is_sale?: boolean,
    min_rating?: number,
    brands?: string[],
  ): Promise<[Product[], number]> {
    const queryBuilder = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'categories')
      .leftJoinAndSelect('product.brand', 'brand')
      .where('categories.slug = :slug', { slug });

    // Áp dụng filter is_active
    if (is_active !== undefined) {
      queryBuilder.andWhere('product.is_active = :is_active', { is_active });
    }

    // Áp dụng filter search
    if (search) {
      queryBuilder.andWhere('product.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    // Áp dụng filter giá
    if (min_price !== undefined) {
      queryBuilder.andWhere('product.price >= :min_price', { min_price });
    }

    if (max_price !== undefined) {
      queryBuilder.andWhere('product.price <= :max_price', { max_price });
    }

    // Áp dụng filter is_sale
    if (is_sale !== undefined) {
      queryBuilder.andWhere('product.is_sale = :is_sale', { is_sale });
    }

    // Áp dụng filter min_rating
    if (min_rating !== undefined) {
      queryBuilder.andWhere('product.rating >= :min_rating', { min_rating });
    }

    // Áp dụng filter brands
    if (brands && brands.length > 0) {
      queryBuilder.andWhere('brand.name IN (:...brands)', { brands });
    }

    const total = await queryBuilder.getCount();

    queryBuilder
      .skip(paginationOptions.skip)
      .take(paginationOptions.take)
      .orderBy('product.created_at', 'DESC');

    const products = await queryBuilder.getMany();

    return [products, total];
  }

  async findFeaturedProducts(
    paginationOptions: {
      skip: number;
      take: number;
    },
    is_active?: boolean,
    search?: string,
    min_price?: number,
    max_price?: number,
    is_sale?: boolean,
    min_rating?: number,
    brands?: string[],
  ): Promise<[Product[], number]> {
    const queryBuilder = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'categories')
      .leftJoinAndSelect('product.brand', 'brand');

    if (is_active !== undefined) {
      queryBuilder.andWhere('product.is_active = :is_active', { is_active });
    }

    // Áp dụng filter search
    if (search) {
      queryBuilder.andWhere('product.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    // Áp dụng filter giá
    if (min_price !== undefined) {
      queryBuilder.andWhere('product.price >= :min_price', { min_price });
    }

    if (max_price !== undefined) {
      queryBuilder.andWhere('product.price <= :max_price', { max_price });
    }

    // Áp dụng filter is_sale
    if (is_sale !== undefined) {
      queryBuilder.andWhere('product.is_sale = :is_sale', { is_sale });
    }

    // Áp dụng filter min_rating
    if (min_rating !== undefined) {
      queryBuilder.andWhere('product.rating >= :min_rating', { min_rating });
    }

    // Áp dụng filter brands
    if (brands && brands.length > 0) {
      queryBuilder.andWhere('brand.name IN (:...brands)', { brands });
    }

    // Lấy tổng số sản phẩm
    const total = await queryBuilder.getCount();

    // Thêm điều kiện sắp xếp để lấy sản phẩm nổi bật
    // Ưu tiên theo thứ tự: sản phẩm đang sale, có stock > 0, mới nhất
    queryBuilder
      .orderBy('product.is_sale', 'DESC')
      // Sử dụng cách khác để sắp xếp theo stock > 0
      .addOrderBy('product.stock', 'DESC')
      .addOrderBy('product.created_at', 'DESC')
      .skip(paginationOptions.skip)
      .take(paginationOptions.take);

    const products = await queryBuilder.getMany();

    return [products, total];
  }
}
