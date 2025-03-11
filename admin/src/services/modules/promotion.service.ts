import { del, get, post, put } from '../api_client';

export const fetchAllPromotions = (data?: any) => {
  return get('/promotions/all', data);
};

export const fetchPromotionById = (id: number) => {
  return get(`/promotions/${id}`);
};

export const createPromotion = (data: any) => {
  return post('/promotions', data);
};

export const updatePromotion = (data: any) => {
  return put(`/promotions/update`, data);
};

export const deletePromotion = (id: number) => {
  return del(`/promotions/${id}`);
};
