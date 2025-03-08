import { del, get, post, postFormData, put } from '../api_client';

export const fetchAllProducts = (data?: any) => {
  return get('/products/all', data);
};

export const fetchProductById = (id: number) => {
  return get(`/products/${id}`);
};

export const createProduct = (data: any) => {
  return post('/products', data);
};

export const updateProduct = (data: any) => {
  return put(`/products/update`, data);
};

export const deleteProduct = (id: number) => {
  return del(`/products/${id}`);
};

export const createCPU = (data: any) => {
  return post('/cpu', data);
};

export const updateCPU = (data: any) => {
  return put('/cpu/update', data);
};

export const createGPU = (data: any) => {
  return post('/gpu', data);
};

export const updateGPU = (data: any) => {
  return put('/gpu/update', data);
};

export const deleteGPU = (id: number) => {
  return del(`/gpu/${id}`);
};

export const createPSU = (data: any) => {
  return post('/psu', data);
};

export const updatePSU = (data: any) => {
  return put('/psu/update', data);
};

export const createMainboard = (data: any) => {
  return post('/mainboard', data);
};

export const updateMainboard = (data: any) => {
  return put('/mainboard/update', data);
};

export const createRam = (data: any) => {
  return post('/ram', data);
};

export const updateRam = (data: any) => {
  return put('/ram/update', data);
};

export const createStorage = (data: any) => {
  return post('/storage', data);
};

export const updateStorage = (data: any) => {
  return put('/storage/update', data);
};

export const createCase = (data: any) => {
  return post('/case', data);
};

export const updateCase = (data: any) => {
  return put('/case/update', data);
};

export const createCooling = (data: any) => {
  return post('/cooling', data);
};

export const updateCooling = (data: any) => {
  return put('/cooling/update', data);
};

export const fetchCPUDetails = async (productId: number) => {
  return get(`/cpu/${productId}`);
};

export const deleteCPU = async (productId: number) => {
  return del(`/cpu/${productId}`);
};

export const fetchGPUDetails = async (productId: number) => {
  return get(`/gpu/${productId}`);
};

export const fetchRAMDetails = async (productId: number) => {
  return get(`/ram/${productId}`);
};

export const fetchPSUDetails = async (productId: number) => {
  return get(`/psu/${productId}`);
};

export const fetchMainboardDetails = async (productId: number) => {
  return get(`/mainboard/${productId}`);
};

export const fetchStorageDetails = async (productId: number) => {
  return get(`/storage/${productId}`);
};

export const fetchCaseDetails = async (productId: number) => {
  return get(`/case/${productId}`);
};

export const fetchCoolingDetails = async (productId: number) => {
  return get(`/cooling/${productId}`);
};
