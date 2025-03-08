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

  async findAll(paginationOptions: {
    skip: number;
    take: number;
  }): Promise<[Order[], number]> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order');

    queryBuilder.leftJoinAndSelect('order.order_items', 'order_items');
    queryBuilder.leftJoinAndSelect('order_items.product', 'product');
    queryBuilder.leftJoinAndSelect('order.address', 'address');

    queryBuilder.orderBy('order.created_at', 'DESC');
    queryBuilder.skip(paginationOptions.skip);
    queryBuilder.take(paginationOptions.take);

    const [orders, total] = await queryBuilder.getManyAndCount();

    return [orders, total];
  }

  async update(id: number, order: Partial<Order>): Promise<Order> {
    // Nếu có cập nhật order items
    if (order.order_items) {
      // Xóa order items cũ
      await this.orderItemRepository
        .createQueryBuilder()
        .delete()
        .where('order_id = :id', { id })
        .execute();

      // Thêm order items mới
      const orderItems = order.order_items.map((item) => {
        item.order = { id } as Order;
        return item;
      });
      await this.orderItemRepository.save(orderItems);

      // Xóa order_items khỏi object update để tránh lỗi
      delete order.order_items;
    }

    // Cập nhật order
    await this.orderRepository.update(id, order);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    // OrderItems sẽ tự động bị xóa do cascade
    await this.orderRepository.delete(id);
  }
}
