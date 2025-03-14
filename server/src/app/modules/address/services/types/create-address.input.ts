export interface CreateAddressInput {
  place_id: string;
  label: string;
  province: string;
  district: string;
  ward: string;
  note: string;
  user_id: number;
  order_id?: number;
  street?: string;
}
