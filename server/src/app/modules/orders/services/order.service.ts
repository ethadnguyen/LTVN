import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateOrderInput } from './types/create-order.input';
import { OrderRepository } from '../repositories/order.repositories';
import { UpdateOrderInput } from './types/update-order.input';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../../products/entities/products.entity';
import { Address } from '../../address/entities/address.entity';
import { Order } from '../entities/order.entity';
import { AddressService } from '../../address/services/address.service';
import { GetAllOrderInput } from './types/get.all.order.input';
import { OrderStatus } from '../enums/order-status.enum';
import { PromotionService } from '../../promotions/services/promotion.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly addressService: AddressService,
    private readonly promotionService: PromotionService,
  ) {}

  async createOrder(input: CreateOrderInput) {
    // Xử lý address
    let address: Address;
    if (input.address_id) {
      address = { id: input.address_id } as Address;
    } else if (input.new_address) {
      address = await this.addressService.createAddressFromGoong(
        input.new_address,
      );
    } else {
      throw new BadRequestException('Address is required');
    }

    // Xử lý order items
    const orderItems = input.order_items.map((item) => {
      const orderItem = new OrderItem();
      orderItem.quantity = item.quantity;
      orderItem.product = { id: item.product_id } as Product;
      return orderItem;
    });

    // Tính toán khuyến mãi nếu có
    let discountAmount = 0;
    let finalPrice = input.total_price;
    let promotionId = null;

    if (input.promotion_id) {
      const productItems = input.order_items.map((item) => ({
        productId: item.product_id,
        quantity: item.quantity,
      }));

      const discountResult = await this.promotionService.calculateDiscount(
        input.promotion_id,
        productItems,
        true, // Tăng số lần sử dụng khuyến mãi
      );

      if (discountResult.isValid) {
        discountAmount = discountResult.discountAmount;
        finalPrice = input.total_price - discountAmount;
        promotionId = input.promotion_id;
      }
    }

    const order = new Order();
    order.order_items = orderItems;
    order.total_price = finalPrice;
    order.original_price = input.total_price;
    order.discount_amount = discountAmount;
    order.promotion_id = promotionId;
    order.phone = input.phone;
    order.status = input.status || OrderStatus.PENDING;
    order.address = address;

    return this.orderRepository.create(order);
  }

  async getOrderById(id: number) {
    return this.orderRepository.findById(id);
  }

  async getAllOrders(queryParams: GetAllOrderInput) {
    const { page = 1, size = 10 } = queryParams;

    const [orders, total] = await this.orderRepository.findAll({
      skip: (page - 1) * size,
      take: size,
    });

    const totalPages = Math.ceil(total / size);

    return {
      total,
      totalPages,
      currentPage: page,
      orders,
    };
  }

  async updateOrder(input: UpdateOrderInput) {
    const orderItems = input.order_items.map((item) => {
      const orderItem = new OrderItem();
      orderItem.quantity = item.quantity;
      orderItem.product = { id: item.product_id } as Product;
      return orderItem;
    });

    let address = new Address();
    if (input.address_id) {
      address = { id: input.address_id } as Address;
    } else if (input.new_address) {
      address = await this.addressService.createAddressFromGoong(
        input.new_address,
      );
    }

    return this.orderRepository.update(input.id, {
      ...input,
      order_items: orderItems,
      address: address,
    });
  }

  async deleteOrder(id: number) {
    return this.orderRepository.delete(id);
  }
}
