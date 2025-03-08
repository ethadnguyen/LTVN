import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';

@Injectable()
export class CartRepository {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
    private readonly dataSource: DataSource,
  ) {}

  async findByUserId(user_id: number): Promise<Cart> {
    return await this.cartRepo
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .where('cart.user_id = :user_id', { user_id })
      .orderBy('items.created_at', 'DESC')
      .getOne();
  }

  async create(cart: Cart): Promise<Cart> {
    const savedCart = await this.cartRepo.save(cart);
    return await this.findById(savedCart.id);
  }

  async findById(id: number): Promise<Cart> {
    return await this.cartRepo
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .where('cart.id = :id', { id })
      .getOne();
  }

  async addItem(cartItem: CartItem): Promise<CartItem> {
    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingItem = await this.cartItemRepo.findOne({
      where: {
        cart_id: cartItem.cart_id,
        product_id: cartItem.product_id,
      },
      relations: ['product'],
    });

    if (existingItem) {
      // Nếu sản phẩm đã tồn tại, cập nhật số lượng
      existingItem.quantity += cartItem.quantity;
      const savedItem = await this.cartItemRepo.save(existingItem);
      return await this.cartItemRepo.findOne({
        where: { id: savedItem.id },
        relations: ['product', 'cart'],
      });
    }

    // Nếu sản phẩm chưa tồn tại, thêm mới
    const savedItem = await this.cartItemRepo.save(cartItem);
    return await this.cartItemRepo.findOne({
      where: { id: savedItem.id },
      relations: ['product', 'cart'],
    });
  }

  async updateItemQuantity(
    cart_id: number,
    product_id: number,
    quantity: number,
  ): Promise<CartItem> {
    const cartItem = await this.cartItemRepo.findOne({
      where: {
        cart_id,
        product_id,
      },
      relations: ['product', 'cart'],
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    cartItem.quantity = quantity;
    const savedItem = await this.cartItemRepo.save(cartItem);
    return await this.cartItemRepo.findOne({
      where: { id: savedItem.id },
      relations: ['product', 'cart'],
    });
  }

  async removeItem(cart_id: number, product_id: number): Promise<void> {
    await this.cartItemRepo.delete({ cart_id, product_id });
  }

  async clearCart(cart_id: number): Promise<void> {
    await this.cartItemRepo.delete({ cart_id });
  }

  async delete(id: number): Promise<void> {
    // Xóa tất cả cart items trước
    await this.dataSource.transaction(async (manager) => {
      await manager.delete(CartItem, { cart_id: id });
      await manager.delete(Cart, id);
    });
  }

  async getCartTotal(cart_id: number): Promise<number> {
    const result = await this.cartItemRepo
      .createQueryBuilder('cart_item')
      .select('SUM(cart_item.price * cart_item.quantity)', 'total')
      .where('cart_item.cart_id = :cart_id', { cart_id })
      .getRawOne();

    return result.total || 0;
  }

  async getItemCount(cart_id: number): Promise<number> {
    const result = await this.cartItemRepo
      .createQueryBuilder('cart_item')
      .select('SUM(cart_item.quantity)', 'count')
      .where('cart_item.cart_id = :cart_id', { cart_id })
      .getRawOne();

    return result.count || 0;
  }
}
