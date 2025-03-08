// This is mock data - In a real app, you would fetch this from an API
export const provinces = [
  { code: '01', name: 'Thành phố Hà Nội' },
  { code: '79', name: 'Thành phố Hồ Chí Minh' },
  { code: '48', name: 'Thành phố Đà Nẵng' },
  // Add more provinces...
];

export const districts = [
  // Hà Nội
  { code: '001', name: 'Quận Ba Đình', provinceCode: '01' },
  { code: '002', name: 'Quận Hoàn Kiếm', provinceCode: '01' },
  // Hồ Chí Minh
  { code: '760', name: 'Quận 1', provinceCode: '79' },
  { code: '761', name: 'Quận 12', provinceCode: '79' },
  // Đà Nẵng
  { code: '490', name: 'Quận Hải Châu', provinceCode: '48' },
  { code: '491', name: 'Quận Thanh Khê', provinceCode: '48' },
  // Add more districts...
];

export const wards = [
  // Ba Đình
  { code: '00001', name: 'Phường Phúc Xá', districtCode: '001' },
  { code: '00004', name: 'Phường Trúc Bạch', districtCode: '001' },
  // Quận 1
  { code: '26734', name: 'Phường Bến Nghé', districtCode: '760' },
  { code: '26737', name: 'Phường Bến Thành', districtCode: '760' },
  // Add more wards...
];
