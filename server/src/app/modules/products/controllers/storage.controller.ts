import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StorageService } from '../services/storage-product.service';
import { StorageRes } from './types/storage_types/storage.res';
import { CreateStorageReq } from './types/storage_types/create-storage.req';
import { UpdateStorageReq } from './types/storage_types/update-storage.req';
import { Public } from 'src/common/decorators/public.decorator';
import { GetAllProductReq } from './types/get.all.product.req';
import { StorageListRes } from './types/storage_types/storage-list.res';

@Public()
@Controller('storage')
@ApiTags('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('/all')
  @ApiOperation({ summary: 'Get all storage products' })
  @ApiResponse({
    status: 200,
    description: 'The storage products have been successfully retrieved.',
    type: StorageListRes,
  })
  async getAllStorages(@Query() queryParams: GetAllProductReq) {
    return this.storageService.getAllStorages(queryParams);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new storage product' })
  @ApiResponse({
    status: 201,
    description: 'The storage product has been successfully created.',
    type: StorageRes,
  })
  async create(@Body() createStorageDto: CreateStorageReq) {
    return this.storageService.create(createStorageDto);
  }

  @Put('/update')
  @ApiOperation({ summary: 'Update a storage product' })
  @ApiResponse({
    status: 200,
    description: 'The storage product has been successfully updated.',
    type: StorageRes,
  })
  async update(@Body() updateStorageDto: UpdateStorageReq) {
    return this.storageService.update(updateStorageDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a storage product by ID' })
  @ApiResponse({
    status: 200,
    description: 'The storage product has been successfully retrieved.',
    type: StorageRes,
  })
  async findById(@Param('id') id: number) {
    return this.storageService.findById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a storage product by ID' })
  @ApiResponse({
    status: 200,
    description: 'The storage product has been successfully deleted.',
  })
  async delete(@Param('id') id: number) {
    return this.storageService.delete(id);
  }
}
