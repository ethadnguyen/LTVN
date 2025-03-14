import { PaginationRes } from '../pagination_types/pagination-res';

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

export interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}
