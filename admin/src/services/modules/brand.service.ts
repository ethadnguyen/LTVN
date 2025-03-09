import { get, post, put, del } from '../api_client';
import { CreateBrandReq, UpdateBrandReq } from '../types/request/brand-req';

export interface BrandQueryParams {
  page?: number;
  size?: number;
  is_active?: boolean;
}

export const fetchAllBrands = async (params?: BrandQueryParams) => {
  return get('/brands', params);
};

export const fetchBrandById = async (id: number) => {
  return get(`/brands/${id}`);
};

export const createBrand = async (data: CreateBrandReq) => {
  return post('/brands', data);
};

export const updateBrand = async (data: UpdateBrandReq) => {
  return put(`/brands/update`, data);
};

export const deleteBrand = async (id: number) => {
  return del(`/brands/${id}`);
};
