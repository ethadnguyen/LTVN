import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../entities/address.entity';
@Injectable()
export class AddressRepository {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async create(address: Address): Promise<Address> {
    return this.addressRepository.save(address);
  }

  async findById(id: number): Promise<Address> {
    return this.addressRepository.findOne({
      where: { id },
      relations: ['user', 'order'],
    });
  }

  async update(id: number, address: Partial<Address>): Promise<Address> {
    await this.addressRepository.update(id, address);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.addressRepository.delete(id);
  }

  async findAll(
    paginationOptions: {
      skip: number;
      take: number;
    },
    user_id?: number,
    order_id?: number,
  ): Promise<[Address[], number]> {
    const queryBuilder = this.addressRepository
      .createQueryBuilder('address')
      .leftJoinAndSelect('address.user', 'user')
      .leftJoinAndSelect('address.order', 'order');

    if (user_id) {
      queryBuilder.andWhere('user.user_id = :user_id', { user_id });
    }

    if (order_id) {
      queryBuilder.andWhere('order.id = :order_id', { order_id });
    }

    queryBuilder
      .orderBy('address.created_at', 'DESC')
      .skip(paginationOptions.skip)
      .take(paginationOptions.take);

    const [addresses, total] = await queryBuilder.getManyAndCount();
    return [addresses, total];
  }
}
