import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
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
import { PaymentStatus } from '../enums/payment-status.enum';
import { PaymentMethod } from '../enums/payment-method.enum';
import { PromotionService } from '../../promotions/services/promotion.service';
import { JwtService } from '@nestjs/jwt';
import { ProductRepository } from '../../products/repositories/products.repositories';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly addressService: AddressService,
    private readonly promotionService: PromotionService,
    private readonly jwtService: JwtService,
    private readonly productRepository: ProductRepository,
  ) {}

  getUserFromToken(authorization: string): {
    userId: number;
    roles: string[];
  } {
    try {
      if (!authorization) {
        throw new UnauthorizedException('No token provided');
      }

      const token = authorization.split(' ')[1];
      const decodedToken = this.jwtService.decode(token);
      return {
        userId: decodedToken.user_id,
        roles: decodedToken.roles || [],
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

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

    // Lấy thông tin sản phẩm từ database để có giá chính xác tại thời điểm đặt hàng
    const productIds = input.order_items.map((item) => item.product_id);
    const products = await this.productRepository.findByIds(productIds);

    if (products.length !== productIds.length) {
      throw new BadRequestException('Some products not found');
    }

    // Xử lý order items
    const orderItems = input.order_items.map((item) => {
      const product = products.find((p) => p.id === item.product_id);
      if (!product) {
        throw new BadRequestException(
          `Product with id ${item.product_id} not found`,
        );
      }

      const orderItem = new OrderItem();
      orderItem.quantity = item.quantity;
      orderItem.product = { id: item.product_id } as Product;
      // Lưu giá của sản phẩm tại thời điểm đặt hàng
      orderItem.price =
        product.is_sale && product.sale_price > 0
          ? product.sale_price
          : product.price;
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
        true,
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
    order.amount = orderItems.reduce((sum, item) => sum + item.quantity, 0);
    order.promotion_id = promotionId;
    order.phone = input.phone;
    order.status = input.status || OrderStatus.PENDING;
    order.address = address;

    order.payment_method = input.payment_method;
    order.payment_status = PaymentStatus.UNPAID;
    if (input.payment_method === PaymentMethod.COD) {
      order.payment_status = PaymentStatus.PENDING;
    }

    if (input.user_id) {
      order.user_id = input.user_id;
    }

    return this.orderRepository.create(order);
  }

  async getOrderById(id: number) {
    return this.orderRepository.findById(id);
  }

  async getAllOrders(queryParams: GetAllOrderInput) {
    const { page = 1, size = 10, user_id, status, searchAddress } = queryParams;

    const [orders, total] = await this.orderRepository.findAll(
      {
        skip: (page - 1) * size,
        take: size,
      },
      user_id,
      status,
      searchAddress,
    );

    const totalPages = Math.ceil(total / size);

    return {
      total,
      totalPages,
      currentPage: page,
      orders,
    };
  }

  async updateOrder(input: UpdateOrderInput) {
    const currentOrder = await this.orderRepository.findById(input.id);
    if (!currentOrder) {
      throw new BadRequestException(`Order with id ${input.id} not found`);
    }

    // Kiểm tra và cập nhật trạng thái thanh toán
    if (input.payment_status) {
      if (input.payment_status === PaymentStatus.PAID && !input.paid_at) {
        input.paid_at = new Date();
      }

      // Nếu đơn hàng được đánh dấu là đã thanh toán
      if (input.payment_status === PaymentStatus.PAID) {
        // Tự động cập nhật trạng thái đơn hàng thành SHIPPING nếu đang ở PENDING
        if (currentOrder.status === OrderStatus.PENDING) {
          input.status = OrderStatus.SHIPPING;
        }
      }

      if (input.status === OrderStatus.CANCELLED) {
        if (currentOrder.payment_status === PaymentStatus.PAID) {
          input.payment_status = PaymentStatus.REFUNDED;
        } else {
          input.payment_status = PaymentStatus.FAILED;
        }
      }
    }

    let address = currentOrder.address;
    if (
      (input.address_id || input.new_address) &&
      currentOrder.status !== OrderStatus.PENDING
    ) {
      throw new BadRequestException(
        'Không thể thay đổi địa chỉ khi đơn hàng không còn ở trạng thái chờ xử lý',
      );
    } else if (input.address_id) {
      address = { id: input.address_id } as Address;
    } else if (input.new_address) {
      address = await this.addressService.createAddressFromGoong(
        input.new_address,
      );
    }

    if (input.order_items && input.order_items.length > 0) {
      if (currentOrder.status !== OrderStatus.PENDING) {
        throw new BadRequestException(
          'Không thể thay đổi sản phẩm khi đơn hàng không còn ở trạng thái chờ xử lý',
        );
      }

      const productIds = input.order_items.map((item) => item.product_id);
      const products = await this.productRepository.findByIds(productIds);

      if (products.length !== productIds.length) {
        throw new BadRequestException('Some products not found');
      }

      const orderItems = input.order_items.map((item) => {
        const product = products.find((p) => p.id === item.product_id);
        if (!product) {
          throw new BadRequestException(
            `Product with id ${item.product_id} not found`,
          );
        }

        const orderItem = new OrderItem();
        orderItem.quantity = item.quantity;
        orderItem.product = { id: item.product_id } as Product;
        orderItem.price =
          product.is_sale && product.sale_price > 0
            ? product.sale_price
            : product.price;
        return orderItem;
      });

      const orderUpdate: Partial<Order> = {
        status: input.status,
        phone: input.phone,
        total_price: input.total_price,
        promotion_id: input.promotion_id,
        payment_status: input.payment_status,
        payment_method: input.payment_method,
        paid_at: input.paid_at,
        address,
        order_items: orderItems,
      };

      return this.orderRepository.update(input.id, orderUpdate);
    }

    const orderUpdate: Partial<Order> = {
      status: input.status,
      phone: input.phone,
      total_price: input.total_price,
      promotion_id: input.promotion_id,
      payment_status: input.payment_status,
      payment_method: input.payment_method,
      paid_at: input.paid_at,
      address,
    };

    return this.orderRepository.update(input.id, orderUpdate);
  }

  async deleteOrder(id: number) {
    return this.orderRepository.delete(id);
  }
}
