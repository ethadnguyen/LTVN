import { del, get, post, put } from '../api-client';

export const getActiveCategories = async (params?: any) => {
  const res = await get('/categories/all', params);
  return res.data;
};
