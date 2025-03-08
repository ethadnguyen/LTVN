export interface Province {
  name: string;
  slug: string;
  type: string;
  name_with_type: string;
  code: string;
}

export interface District {
  name: string;
  type: string;
  slug: string;
  name_with_type: string;
  path: string;
  path_with_type: string;
  code: string;
  parent_code: string;
}

export interface Ward {
  name: string;
  type: string;
  slug: string;
  name_with_type: string;
  path: string;
  path_with_type: string;
  code: string;
  parent_code: string;
}

export interface ProvinceList {
  [key: string]: Province;
}

export interface DistrictList {
  [key: string]: District;
}

export interface WardList {
  [key: string]: Ward;
}
