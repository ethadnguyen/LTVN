export interface Province {
  code: string;
  name: string;
}

export interface District {
  code: string;
  name: string;
  provinceCode: string;
}

export interface Ward {
  code: string;
  name: string;
  districtCode: string;
}

export interface VietnameseAddress {
  province: Province | null;
  district: District | null;
  ward: Ward | null;
  streetAddress: string;
}
