export interface CreateAddressRequest {
  place_id: string;
  user_id: number;
  note?: string;
  street?: string;
  province?: string;
  district?: string;
  ward?: string;
  label?: string;
  order_id?: number;
}

export interface UpdateAddressRequest {
  id: number;
  place_id?: string;
  note?: string;
  street?: string;
  label?: string;
  province?: string;
  district?: string;
  ward?: string;
  user_id?: number;
  order_id?: number;
}
