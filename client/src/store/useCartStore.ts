import { create } from 'zustand';
import { CartRes } from '@/services/types/response/cart_types/cart';
import { AddToCartReq } from '@/services/types/request/cart_types/add-to-cart.req';
import { UpdateCartItemReq } from '@/services/types/request/cart_types/update-cart-item.req';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '@/services/modules/cart.service';

interface CartStore {
  cart: CartRes | null;
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (input: AddToCartReq) => Promise<void>;
  updateCartItem: (input: UpdateCartItemReq) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>((set) => ({
  cart: null,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    try {
      set({ isLoading: true, error: null });
      const cart = await getCart();
      set({ cart, isLoading: false });
    } catch (error: unknown) {
      console.error('Failed to fetch cart:', error);
      set({
        error: 'Không thể tải giỏ hàng',
        isLoading: false,
      });
    }
  },

  addToCart: async (input: AddToCartReq) => {
    try {
      set({ isLoading: true, error: null });
      await addToCart(input);
      const cart = await getCart();
      set({ cart, isLoading: false });
    } catch (error: unknown) {
      console.error('Failed to add to cart:', error);
      set({
        error: 'Không thể thêm vào giỏ hàng',
        isLoading: false,
      });
    }
  },

  updateCartItem: async (input: UpdateCartItemReq) => {
    try {
      set({ isLoading: true, error: null });
      await updateCartItem(input);
      const cart = await getCart();
      set({ cart, isLoading: false });
    } catch (error: unknown) {
      console.error('Failed to update cart item:', error);
      set({
        error: 'Không thể cập nhật giỏ hàng',
        isLoading: false,
      });
    }
  },

  removeFromCart: async (productId: number) => {
    try {
      set({ isLoading: true, error: null });
      await removeFromCart(productId);
      const cart = await getCart();
      set({ cart, isLoading: false });
    } catch (error: unknown) {
      console.error('Failed to remove from cart:', error);
      set({
        error: 'Không thể xóa sản phẩm khỏi giỏ hàng',
        isLoading: false,
      });
    }
  },

  clearCart: async () => {
    try {
      set({ isLoading: true, error: null });
      await clearCart();
      set({
        cart: { items: [], total: 0, item_count: 0 },
        isLoading: false,
      });
    } catch (error: unknown) {
      console.error('Failed to clear cart:', error);
      set({
        error: 'Không thể xóa giỏ hàng',
        isLoading: false,
      });
    }
  },
}));
