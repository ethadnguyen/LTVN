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

export interface CPUSpecifications {
  socket_type: string;
  cores: number;
  threads: number;
  base_clock: string;
  boost_clock: string;
  wattage: number;
  cache: string;
  tdp: number;
  pcie_version: string;
  pcie_slots: number;
  max_memory_capacity: number;
  supported_ram: {
    ram_type: string;
    max_speed: number;
  }[];
  supported_chipsets: string[];
  has_integrated_gpu: boolean;
}

export interface GPUSpecifications {
  chipset: string;
  memory_size: number;
  memory_type: string;
  min_psu_wattage: number;
  power_connector: string;
  core_clock: string;
  boost_clock: string;
  tdp: number;
  pcie_version: string;
  slot_size: string;
  cuda_cores: number;
  tensor_cores: number;
  display_ports: string[];
  length: number;
}

export interface RAMSpecifications {
  ram_type: string;
  speed: number;
  capacity: number;
  latency: string;
  voltage: number;
  module_type: string;
  ecc_support: boolean;
  channel: string;
  timing: string;
  rgb: boolean;
  heat_spreader: boolean;
}

export interface MainboardSpecifications {
  form_factor: string;
  socket_type: string;
  chipset: string;
  ram_type: string;
  ram_speed: number;
  ram_slots: number;
  max_ram_capacity: number;
  pcie_slots: number;
  pcie_version: string;
  m2_slots: number;
  sata_slots: number;
  usb_ports: number;
  rgb: boolean;
  size: string;
  rgb_headers: number;
  has_video_ports: boolean;
}

export interface StorageSpecifications {
  storage_type: string;
  capacity: number;
  read_speed: number;
  write_speed: number;
  form_factor: string;
  cache: number;
}

export interface PSUSpecifications {
  wattage: number;
  efficiency_rating: number;
  form_factor: string;
  modular: boolean;
  input_voltage: number;
  fan_size: number;
  fan_speed: number;
  noise_level: number;
  fan_bearing: string;
  rgb: boolean;
  atx12v_version: string;
  pcie_connectors: number;
  sata_connectors: number;
  eps_connectors: number;
  protection_features: ProtectionType[];
}

export interface CaseSpecifications {
  length: number;
  width: number;
  height: number;
  color: string;
  material: string;
  psu_max_length: number;
  cpu_cooler_height: number;
  max_gpu_length: number;
  form_factor: string[];
}

export interface CoolingSpecifications {
  cooling_type: string;
  length: number;
  width: number;
  height: number;
  socket_support: string[];
  fan_speed: number;
  noise_level: number;
  fan_size: number;
}

export type ProductSpecifications =
  | CPUSpecifications
  | GPUSpecifications
  | RAMSpecifications
  | MainboardSpecifications
  | StorageSpecifications
  | PSUSpecifications
  | CaseSpecifications
  | CoolingSpecifications;
