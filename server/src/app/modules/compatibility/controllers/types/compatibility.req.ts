import { ApiProperty } from '@nestjs/swagger';
import { CaseRes } from 'src/app/modules/products/controllers/types/case_types/case.res';
import { CoolingRes } from 'src/app/modules/products/controllers/types/cooling_types/cooling.res';
import { CpuRes } from 'src/app/modules/products/controllers/types/cpu_types/cpu.res';
import { GpuRes } from 'src/app/modules/products/controllers/types/gpu_types/gpu.res';
import { MainboardRes } from 'src/app/modules/products/controllers/types/mainboard_types/mainboard.res';
import { PsuRes } from 'src/app/modules/products/controllers/types/psu_types/psu.res';
import { RamRes } from 'src/app/modules/products/controllers/types/ram_types/ram.res';
import { StorageRes } from 'src/app/modules/products/controllers/types/storage_types/storage.res';
import { IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductType } from 'src/app/modules/products/enums/product-type.enum';

// DTO cho request chỉ chứa ID sản phẩm và loại sản phẩm
export class ProductIdWithType {
  @ApiProperty({ description: 'ID của sản phẩm' })
  @IsNumber()
  product_id: number;

  @ApiProperty({ enum: ProductType, description: 'Loại sản phẩm' })
  product_type: ProductType;
}

// DTO cho request chỉ chứa danh sách ID sản phẩm
export class CompatibilityByProductIdsReq {
  @ApiProperty({
    type: [ProductIdWithType],
    description: 'Danh sách ID sản phẩm và loại sản phẩm',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductIdWithType)
  products: ProductIdWithType[];
}

// DTO cho request chỉ chứa ID
export class CompatibilityByIdReq {
  @ApiProperty({ required: false, description: 'ID của CPU' })
  @IsOptional()
  @IsNumber()
  cpuId?: number;

  @ApiProperty({ required: false, description: 'ID của GPU' })
  @IsOptional()
  @IsNumber()
  gpuId?: number;

  @ApiProperty({ required: false, description: 'ID của Mainboard' })
  @IsOptional()
  @IsNumber()
  mainboardId?: number;

  @ApiProperty({
    required: false,
    description: 'Danh sách ID của RAM',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  ramIds?: number[];

  @ApiProperty({ required: false, description: 'ID của PSU' })
  @IsOptional()
  @IsNumber()
  psuId?: number;

  @ApiProperty({ required: false, description: 'ID của Case' })
  @IsOptional()
  @IsNumber()
  caseId?: number;

  @ApiProperty({ required: false, description: 'ID của tản nhiệt' })
  @IsOptional()
  @IsNumber()
  coolingId?: number;

  @ApiProperty({
    required: false,
    description: 'Danh sách ID của ổ cứng',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  storageIds?: number[];
}

// DTO gốc cho request chứa toàn bộ object
export class CompatibilityReq {
  @ApiProperty({ required: false, description: 'CPU được chọn' })
  @IsOptional()
  @ValidateNested()
  @Type(() => CpuRes)
  cpu?: CpuRes;

  @ApiProperty({ required: false, description: 'GPU được chọn' })
  @IsOptional()
  @ValidateNested()
  @Type(() => GpuRes)
  gpu?: GpuRes;

  @ApiProperty({ required: false, description: 'Mainboard được chọn' })
  @IsOptional()
  @ValidateNested()
  @Type(() => MainboardRes)
  mainboard?: MainboardRes;

  @ApiProperty({
    required: false,
    description: 'Danh sách RAM được chọn',
    type: [RamRes],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RamRes)
  rams?: RamRes[];

  @ApiProperty({ required: false, description: 'PSU được chọn' })
  @IsOptional()
  @ValidateNested()
  @Type(() => PsuRes)
  psu?: PsuRes;

  @ApiProperty({ required: false, description: 'Case máy tính được chọn' })
  @IsOptional()
  @ValidateNested()
  @Type(() => CaseRes)
  computerCase?: CaseRes;

  @ApiProperty({ required: false, description: 'Tản nhiệt được chọn' })
  @IsOptional()
  @ValidateNested()
  @Type(() => CoolingRes)
  cooling?: CoolingRes;

  @ApiProperty({
    required: false,
    description: 'Danh sách ổ cứng được chọn',
    type: [StorageRes],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StorageRes)
  storages?: StorageRes[];
}
