import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(order: Order): Promise<Order> {
    // Lưu order trước
    const savedOrder = await this.orderRepository.save(order);

    // Lưu order items
    if (order.order_items) {
      const orderItems = order.order_items.map((item) => {
        item.order = savedOrder;
        return item;
      });
      await this.orderItemRepository.save(orderItems);
    }

    return this.findById(savedOrder.id);
  }

  async findById(id: number): Promise<Order> {
    return this.orderRepository.findOne({
      where: { id },
      relations: ['order_items', 'order_items.product', 'address'],
    });
  }

  async findAll(
    paginationOptions: {
      skip: number;
      take: number;
    },
    user_id?: number,
    status?: string,
    searchAddress?: string,
  ): Promise<[Order[], number]> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order');

    queryBuilder.leftJoinAndSelect('order.order_items', 'order_items');
    queryBuilder.leftJoinAndSelect('order_items.product', 'product');
    queryBuilder.leftJoinAndSelect('order.address', 'address');

    if (user_id) {
      queryBuilder.where('order.user_id = :user_id', { user_id });
    }

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    if (searchAddress) {
      queryBuilder.andWhere(
        'address.street LIKE :search OR address.ward LIKE :search OR address.district LIKE :search OR address.province LIKE :search',
        { search: `%${searchAddress}%` },
      );
    }

    queryBuilder.orderBy('order.created_at', 'DESC');
    queryBuilder.skip(paginationOptions.skip);
    queryBuilder.take(paginationOptions.take);

    const [orders, total] = await queryBuilder.getManyAndCount();

    return [orders, total];
  }

  async update(id: number, order: Partial<Order>): Promise<Order> {
    if (order.order_items) {
      await this.orderItemRepository
        .createQueryBuilder()
        .delete()
        .where('order_id = :id', { id })
        .execute();

      const orderItems = order.order_items.map((item) => {
        item.order = { id } as Order;
        return item;
      });
      await this.orderItemRepository.save(orderItems);

      delete order.order_items;
    }

    await this.orderRepository.update(id, order);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.orderRepository.delete(id);
  }
}
