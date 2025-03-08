import { get, post, put, del } from '../api-client';
import { AddToCartReq } from '../types/request/cart_types/add-to-cart.req';
import { UpdateCartItemReq } from '../types/request/cart_types/update-cart-item.req';
import { CartRes } from '../types/response/cart_types/cart';

export const getCart = async (): Promise<CartRes> => {
  const res = await get('/cart');
  return res.data;
};

export const addToCart = async (input: AddToCartReq): Promise<void> => {
  await post('/cart/items', input);
};

export const updateCartItem = async (
  input: UpdateCartItemReq
): Promise<void> => {
  await put('/cart/items', input);
};

export const removeFromCart = async (productId: number): Promise<void> => {
  await del(`/cart/items/${productId}`);
};

export const clearCart = async (): Promise<void> => {
  await del('/cart/clear');
};
