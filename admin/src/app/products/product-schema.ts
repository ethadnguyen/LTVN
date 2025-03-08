import {
  ATX12VType,
  ChannelType,
  ChipsetType,
  CoolingType,
  DisplayPortsType,
  GpuMemoryType,
  MainboardFormFactor,
  ModuleType,
  PCIeType,
  PowerConnectorType,
  ProductType,
  ProtectionType,
  RamType,
  SocketType,
  StorageType,
} from '@/services/types/request/product-req';
import { z } from 'zod';

// Schema cho product cơ bản
export const baseProductSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm không được để trống'),
  description: z.string().min(1, 'Mô tả không được để trống'),
  price: z.number().min(1, 'Giá phải lớn hơn 0'),
  stock: z.number().min(1, 'Số lượng phải lớn hơn 0'),
  category_id: z.array(z.string()).min(1, 'Phải chọn ít nhất 1 danh mục'),
  is_active: z.boolean(),
  type: z.nativeEnum(ProductType),
  specifications: z.record(z.string(), z.string()),
  images: z.array(z.string()).optional(),
});

// Schema riêng cho CPU
export const cpuSchema = z.object({
  socket_type: z.nativeEnum(SocketType, {
    errorMap: () => ({ message: 'Vui lòng chọn socket' }),
  }),
  cores: z.number().min(1, 'Vui lòng nhập số nhân'),
  supported_chipsets: z.array(z.nativeEnum(ChipsetType)),
  supported_ram: z.array(
    z.object({
      ram_type: z.nativeEnum(RamType),
      max_speed: z.number().min(1, 'Tốc độ không được âm'),
    })
  ),
  threads: z.number().min(1, 'Vui lòng nhập số luồng'),
  base_clock: z.string().min(1, 'Vui lòng nhập xung cơ bản'),
  boost_clock: z.string().min(1, 'Vui lòng nhập xung boost'),
  cache: z.string().min(1, 'Vui lòng nhập cache'),
  tdp: z.number().min(0, 'Vui lòng nhập TDP'),
  wattage: z.number().min(0, 'Vui lòng nhập công suất'),
  max_memory_capacity: z.number().min(0, 'Vui lòng nhập dung lượng RAM tối đa'),
  pcie_version: z.nativeEnum(PCIeType),
  pcie_slots: z.number().min(0, 'Vui lòng nhập số khe PCIe'),
  has_integrated_gpu: z.boolean().default(false),
});

// Schema riêng cho GPU
export const gpuSchema = z.object({
  chipset: z.string().min(1, 'Chipset không được để trống'),
  memory_size: z.number().min(1, 'Dung lượng bộ nhớ phải lớn hơn 0'),
  memory_type: z.nativeEnum(GpuMemoryType, {
    errorMap: () => ({ message: 'Vui lòng chọn loại bộ nhớ' }),
  }),
  core_clock: z.string().min(1, 'Xung nhịp không được để trống'),
  boost_clock: z.string().min(1, 'Xung boost không được để trống'),
  min_psu_wattage: z.number().min(0, 'Công suất nguồn không được âm'),
  power_connector: z.nativeEnum(PowerConnectorType, {
    errorMap: () => ({ message: 'Vui lòng chọn cổng kết nối' }),
  }),
  tdp: z.number().min(0, 'TDP không được âm'),
  cuda_cores: z.number().min(1, 'Số CUDA cores không dưới 0'),
  tensor_cores: z.number().min(1, 'Số Tensor cores không dưới 0'),
  display_ports: z
    .array(z.nativeEnum(DisplayPortsType))
    .min(1, 'Vui lòng chọn ít nhất một cổng kết nối'),
  pcie_version: z.nativeEnum(PCIeType),
  slot_size: z.string().min(1, 'Kích thước slot không được để trống'),
  length: z.number().min(1, 'Chiều dài không được âm'),
});

export const ramSchema = z.object({
  ram_type: z.nativeEnum(RamType),
  speed: z.number().min(1, 'Tốc độ không được âm'),
  capacity: z.number().min(1, 'Dung lượng không được âm'),
  latency: z.string().min(1, 'Độ trễ không được để trống'),
  voltage: z.number().min(0, 'Điện áp không được âm'),
  module_type: z.nativeEnum(ModuleType),
  ecc_support: z.boolean().default(false),
  channel: z.nativeEnum(ChannelType),
  timing: z.string().min(1, 'Độ trễ không được để trống'),
  rgb: z.boolean().default(false),
  heat_spreader: z.boolean().default(false),
});

export const psuSchema = z.object({
  wattage: z.number().min(0, 'Công suất không được âm'),
  efficiency_rating: z.number().min(0, 'Hiệu suất không được âm'),
  form_factor: z.nativeEnum(MainboardFormFactor),
  modular: z.boolean().default(false),
  input_voltage: z.number().min(0, 'Điện áp không được âm'),
  atx12v_version: z.nativeEnum(ATX12VType),
  protection_features: z.array(z.nativeEnum(ProtectionType)),
  pcie_connectors: z.number().min(0, 'Số kết nối PCIe không được âm'),
  sata_connectors: z.number().min(0, 'Số kết nối SATA không được âm'),
  eps_connectors: z.number().min(0, 'Số kết nối EPS không được âm'),
  fan_size: z.number().min(0, 'Kích thước quạt không được âm'),
  fan_speed: z.number().min(0, 'Tốc độ quạt không được âm'),
  noise_level: z.number().min(0, 'Mức ồn không được âm'),
  fan_bearing: z.string().min(1, 'Loại quạt không được để trống'),
  rgb: z.boolean().default(false),
});

export const mainboardSchema = z.object({
  socket_type: z.nativeEnum(SocketType),
  form_factor: z.nativeEnum(MainboardFormFactor),
  chipset: z.nativeEnum(ChipsetType),
  ram_type: z.nativeEnum(RamType),
  ram_speed: z.number().min(1, 'Tốc độ RAM không được âm'),
  ram_slots: z.number().min(1, 'Số khe RAM không được âm'),
  max_ram_capacity: z.number().min(1, 'Dung lượng RAM tối đa không được âm'),
  pcie_slots: z.number().min(1, 'Số khe PCIe không được âm'),
  pcie_version: z.nativeEnum(PCIeType),
  m2_slots: z.number().min(1, 'Số khe M.2 không được âm'),
  sata_slots: z.number().min(1, 'Số khe SATA không được âm'),
  usb_ports: z.number().min(1, 'Số cổng USB không được âm'),
  rgb: z.boolean().default(false),
  size: z.string().min(1, 'Kích thước không được để trống'),
  has_video_ports: z.boolean().default(false),
});

export const storageSchema = z.object({
  storage_type: z.nativeEnum(StorageType),
  capacity: z.number().min(1, 'Dung lượng không được âm'),
  read_speed: z.number().min(1, 'Tốc độ đọc không được âm'),
  write_speed: z.number().min(1, 'Tốc độ ghi không được âm'),
  form_factor: z.string().min(1, 'Kiểu dáng không được để trống'),
  cache: z.number().min(1, 'Dung lượng cache không được âm'),
});

export const caseSchema = z.object({
  length: z.number().min(0, 'Chiều dài không được âm'),
  width: z.number().min(0, 'Chiều rộng không được âm'),
  height: z.number().min(0, 'Chiều cao không được âm'),
  color: z.string().min(1, 'Màu sắc không được để trống'),
  material: z.string().min(1, 'Chất liệu không được để trống'),
  psu_max_length: z.number().min(0, 'Chiều dài nguồn không được âm'),
  cpu_cooler_height: z.number().min(0, 'Chiều cao tản nhiệt không được âm'),
  max_gpu_length: z.number().min(0, 'Chiều dài GPU tối đa không được âm'),
  form_factor: z.array(z.nativeEnum(MainboardFormFactor)).default([]),
});

export const coolingSchema = z.object({
  cooling_type: z.nativeEnum(CoolingType),
  length: z.number().min(1, 'Chiều dài không được âm'),
  width: z.number().min(1, 'Chiều rộng không được âm'),
  height: z.number().min(1, 'Chiều cao không được âm'),
  socket_support: z.array(z.nativeEnum(SocketType)),
  fan_speed: z.number().min(1, 'Tốc độ quạt không được âm'),
  noise_level: z.number().min(1, 'Mức ồn không được âm'),
  fan_size: z.number().min(1, 'Kích thước quạt không được âm'),
});

export type ProductFormValues = z.infer<typeof baseProductSchema>;
export type CPUFormValues = z.infer<typeof cpuSchema>;
export type GPUFormValues = z.infer<typeof gpuSchema>;
export type RAMFormValues = z.infer<typeof ramSchema>;
export type PSUFormValues = z.infer<typeof psuSchema>;
export type MainboardFormValues = z.infer<typeof mainboardSchema>;
export type StorageFormValues = z.infer<typeof storageSchema>;
export type CaseFormValues = z.infer<typeof caseSchema>;
export type CoolingFormValues = z.infer<typeof coolingSchema>;
