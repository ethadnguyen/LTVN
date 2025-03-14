import { del, get, post, put } from '../api_client';
import {
  CreateAddressRequest,
  UpdateAddressRequest,
} from '../types/request/address_types/address.req';

interface AddressParams {
  page?: number;
  size?: number;
  user_id?: number;
  order_id?: number;
}
// Lấy tất cả địa chỉ
export const getAllAddresses = async (params?: AddressParams) => {
  const res = await get('/address/all', params);
  return res.data;
};

// Tìm kiếm địa chỉ bằng từ khóa
export const searchAddress = async (keyword: string) => {
  const res = await get('/address/search', { keyword });
  return res.data;
};

// Tạo địa chỉ mới từ Goong place_id
export const createAddress = async (data: CreateAddressRequest) => {
  const res = await post('/address', data);
  return res.data;
};

// Cập nhật địa chỉ
export const updateAddress = async (data: UpdateAddressRequest) => {
  const res = await put('/address/update', data);
  return res.data;
};

// Lấy danh sách tỉnh/thành phố
export const getProvinces = async () => {
  const res = await get('/address/provinces');
  return res.data;
};

// Lấy danh sách quận/huyện theo mã tỉnh/thành phố
export const getDistricts = async (provinceCode: string) => {
  const res = await get(`/address/districts/${provinceCode}`);
  return res.data;
};

// Lấy danh sách phường/xã theo mã quận/huyện
export const getWards = async (districtCode: string) => {
  const res = await get(`/address/wards/${districtCode}`);
  return res.data;
};

// Gợi ý địa chỉ dựa trên vị trí đã chọn
export const suggestAddress = async (
  province: string,
  district: string,
  ward: string,
  keyword: string
) => {
  const res = await get('/address/suggest', {
    province,
    district,
    ward,
    keyword,
  });
  return res.data;
};

export const deleteAddress = async (id: number) => {
  return await del(`address/${id}`);
};
