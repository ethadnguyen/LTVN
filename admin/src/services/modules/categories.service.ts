import { del, get, post, put } from '../api_client';
import { CategoryReq } from '../types/request/category-req';

export const fetchAllCategories = (data?: any) => {
  return get('/categories/all', data);
};

export const fetchCategory = (id: number) => {
  return get(`/categories/${id}`);
};

export const createCategory = (data: CategoryReq) => {
  return post('/categories', data);
};

export const updateCategory = (id: number, data: CategoryReq) => {
  return put(`/categories/update`, { id, ...data });
};

export const deleteCategory = (id: number) => {
  return del(`/categories/${id}`);
};
