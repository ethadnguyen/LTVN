import { get } from '../api_client';

interface ProductParams {
  category_id?: string;
  is_active?: boolean;
  page?: number;
  size?: number;
  search?: string;
}

export const getActiveProducts = async (params?: ProductParams) => {
  const res = await get('/products/all', params);
  return res.data;
};

export const getFeaturedProducts = async (params?: ProductParams) => {
  const res = await get('/products/featured', params);
  return res.data;
};

export const getProductsByCategorySlug = async (
  slug: string,
  params?: ProductParams
) => {
  const res = await get(`/products/category/${slug}`, params);
  return res.data;
};

export const getProductById = async (id: number) => {
  const res = await get(`/products/${id}`);
  return res.data;
};

export const getProductBySlug = async (slug: string) => {
  const res = await get(`/products/slug/${slug}`);
  return res.data;
};

export const fetchCPUDetails = async (id: number) => {
  const res = await get(`/cpu/${id}`);
  return res.data;
};

export const fetchGPUDetails = async (id: number) => {
  const res = await get(`/gpu/${id}`);
  return res.data;
};

export const fetchMainboardDetails = async (id: number) => {
  const res = await get(`/mainboard/${id}`);
  return res.data;
};

export const fetchRamDetails = async (id: number) => {
  const res = await get(`/ram/${id}`);
  return res.data;
};

export const fetchStorageDetails = async (id: number) => {
  const res = await get(`/storage/${id}`);
  return res.data;
};

export const fetchPSUDetails = async (id: number) => {
  const res = await get(`/psu/${id}`);
  return res.data;
};

export const fetchCoolingDetails = async (id: number) => {
  const res = await get(`/cooling/${id}`);
  return res.data;
};

export const fetchCaseDetails = async (id: number) => {
  const res = await get(`/case/${id}`);
  return res.data;
};
