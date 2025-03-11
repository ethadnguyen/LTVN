import { get } from '../api_client';

interface BrandParams {
  page?: number;
  size?: number;
  is_active?: boolean;
}

export const getAllBrands = async (params?: BrandParams) => {
  const res = await get('/brands', params);
  return res.data;
};

export const getActiveBrands = async () => {
  const res = await get('/brands/active');
  return res.data;
};

export const getBrandById = async (id: number) => {
  const res = await get(`/brands/${id}`);
  return res.data;
};
