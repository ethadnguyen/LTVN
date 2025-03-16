import { PaginationRes } from './pagination-res';

export interface AddressResponse {
  id: number;
  label: string;
  street: string;
  note: string;
  province: string;
  district: string;
  ward: string;
  place_id: string;
  created_at: string;
  updated_at: string;
}

export interface AddressListResponse extends PaginationRes {
  addresses: AddressResponse[];
}
