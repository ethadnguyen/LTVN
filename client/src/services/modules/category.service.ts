import { del, get, post, put } from '../api_client';

export const getActiveCategories = async (params?: any) => {
  const res = await get('/categories/all', params);
  return res.data;
};

export const getCategoryBySlug = async (slug: string) => {
  const res = await get(`/categories/slug/${slug}`);
  return res.data;
};
