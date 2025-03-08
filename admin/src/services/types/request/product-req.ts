export enum ProductType {
  CPU = 'CPU',
  GPU = 'GPU',
  RAM = 'RAM',
  MAINBOARD = 'MAINBOARD',
  STORAGE = 'STORAGE',
  POWER_SUPPLY = 'POWER_SUPPLY',
  COOLING = 'COOLING',
  CASE = 'CASE',
}

export enum RamType {
  DDR = 'DDR',
  DDR2 = 'DDR2',
  DDR3 = 'DDR3',
  DDR4 = 'DDR4',
  DDR5 = 'DDR5',
}

export enum GpuMemoryType {
  GDDR6 = 'GDDR6',
  GDDR6X = 'GDDR6X',
  GDDR6X8 = 'GDDR6X8',
  GDDR6X16 = 'GDDR6X16',
  GDDR6X32 = 'GDDR6X32',
  GDDR6X64 = 'GDDR6X64',
}

export enum ModuleType {
  DIMM = 'DIMM',
  SODIMM = 'SODIMM',
}

export enum ChannelType {
  SINGLE = 'Single',
  DUAL = 'Dual',
  QUAD = 'Quad',
  OCTA = 'Octa',
}

export enum ATX12VType {
  ATX12V_1_0 = 'ATX12V 1.0',
  ATX12V_2_0 = 'ATX12V 2.0',
  ATX12V_2_3 = 'ATX12V 2.3',
  ATX12V_2_4 = 'ATX12V 2.4',
  ATX12V_2_5 = 'ATX12V 2.5',
  ATX12V0 = 'ATX12V0',
}

export enum ProtectionType {
  OVP = 'Over Voltage Protection',
  UVP = 'Under Voltage Protection',
  OCP = 'Over Current Protection',
  OPP = 'Over Power Protection',
  OTP = 'Over Temperature Protection',
  SCP = 'Short Circuit Protection',
  NLO = 'No Load Operation',
  SIP = 'Surge & Inrush Protection',
}

export enum MainboardFormFactor {
  ATX = 'ATX',
  MINI_ATX = 'MINI_ATX',
  MICRO_ATX = 'MICRO_ATX',
  MINI_ITX = 'MINI_ITX',
  ITX = 'ITX',
}

export enum DisplayPortsType {
  HDMI = 'HDMI',
  DisplayPort = 'DisplayPort',
  DVI = 'DVI',
  VGA = 'VGA',
  DVI_D = 'DVI-D',
  DVI_I = 'DVI-I',
  DVI_A = 'DVI-A',
  DVI_I_MST = 'DVI-I-MST',
  DVI_D_MST = 'DVI-D-MST',
  DVI_A_MST = 'DVI-A-MST',
  DVI_D_MST_HDCP = 'DVI-D-MST-HDCP',
  DVI_A_MST_HDCP = 'DVI-A-MST-HDCP',
}

export enum PowerConnectorType {
  PIN_6 = '6-pin',
  PIN_8 = '8-pin',
  PIN_12 = '12-pin',
  PIN_16 = '16-pin',
}

export enum SocketType {
  LGA1151 = 'LGA1151',
  LGA1200 = 'LGA1200',
  LGA1700 = 'LGA1700',
  AM4 = 'AM4',
  AM5 = 'AM5',
  TR4 = 'TR4',
}

export enum StorageType {
  HDD = 'HDD',
  SSD = 'SSD',
  NVMe = 'NVMe',
  M2 = 'M2',
  SATA = 'SATA',
  SAS = 'SAS',
  SCSI = 'SCSI',
}

export enum CoolingType {
  AIR_COOLER = 'AIR_COOLER',
  AIO_COOLER = 'AIO_COOLER',
}

export enum ChipsetType {
  Z790 = 'Z790',
  B760 = 'B760',
  H770 = 'H770',
  H610 = 'H610',
  Z690 = 'Z690',
  B660 = 'B660',
  H670 = 'H670',
  Z590 = 'Z590',
  B560 = 'B560',

  // AMD Chipsets (AM5, AM4)
  X670E = 'X670E',
  X670 = 'X670',
  B650E = 'B650E',
  B650 = 'B650',
  A620 = 'A620',
  X570 = 'X570',
  B550 = 'B550',
}

export enum PCIeType {
  PCIE_1_0 = 'PCIe 1.0',
  PCIE_2_0 = 'PCIe 2.0',
  PCIE_3_0 = 'PCIe 3.0',
  PCIE_4_0 = 'PCIe 4.0',
  PCIE_5_0 = 'PCIe 5.0',
}

export interface ProductReq {
  name: string;
  description: string;
  price: number;
  category_id: number | number[];
  images: string[];
  stock: number;
  type: ProductType;
  is_active: boolean;
  specifications: Record<string, any>;
}

export interface CPUReq {
  socket: string;
  cores: number;
  threads: number;
  base_clock: number;
  boost_clock: number;
  wattage: number;
  tdp: number;
  cache: string;
  pcie_version: string;
  pcie_slots?: number;
  max_memory_capacity: number;
}

export interface GPUReq {
  chipset: string;
  memory_size: number;
  memory_type: string;
  min_psu_wattage: number;
  power_connector: string;
  core_clock: number;
  boost_clock: number;
  tdp: number;
  pcie_version: string;
  slot_size: number;
  cuda_cores: number;
  tensor_cores: number;
  display_ports: string[];
  length: number;
}

export interface PSUReq {
  wattage: number;
  efficiency_rating: number;
  form_factor: string;
  modular: boolean;
  input_voltage: number;
  atx12v_version: string;
  protection_features: string[];
  pcie_connectors: number;
  sata_connectors: number;
  eps_connectors: number;
  fan_size: number;
  fan_speed: number;
  noise_level: number;
  fan_bearing: string;
  rgb: boolean;
}

export interface MainboardReq {
  socket_type: string;
  form_factor: string;
  chipset: string;
  ram_slots: number;
  max_ram_capacity: number;
  pcie_slots: number;
  pcie_version: string;
  m2_slots: number;
  sata_slots: number;
  usb_ports: number;
  lan: string;
  wireless: string;
  audio: string;
  graphics_integrated: string;
  bios_version: string;
  rgb: boolean;
  size: string;
}

export interface RamReq {
  ram_type: string;
  speed: number;
  modules: number;
  latency: string;
  voltage: number;
  module_type: string;
  ecc_support: boolean;
  channel: string;
  timing: string;
  rgb: boolean;
  heat_spreader: boolean;
}

export interface StorageReq {
  storage_type: string;
  capacity: number;
  read_speed: number;
  write_speed: number;
  interface: string;
  form_factor: string;
  cache: number;
}

export interface CaseReq {
  size: string;
  color: string;
  material: string;
  psu_max_length: number;
  cpu_cooler_height: number;
  max_gpu_length: number;
  form_factor: string[];
}

export interface CoolingReq {
  cooling_type: string;
  size: string;
  socket_support: string[];
  fan_speed: number;
  noise_level: number;
  fan_size: number;
}
