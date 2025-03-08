import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { GpuService } from '../services/gpu-product.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GpuRes } from './types/gpu_types/gpu.res';
import { CreateGpuReq } from './types/gpu_types/create-gpu.req';
import { UpdateGpuReq } from './types/gpu_types/update-gpu.req';
import { Public } from 'src/common/decorators/public.decorator';
import { GetAllProductReq } from './types/get.all.product.req';
import { GpuListRes } from './types/gpu_types/gpu-list.res';

@Public()
@Controller('gpu')
@ApiTags('GPU')
export class GpuController {
  constructor(private readonly gpuService: GpuService) {}

  @Get('/all')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all GPUs' })
  @ApiResponse({
    status: 200,
    description: 'All GPUs have been successfully retrieved.',
    type: GpuListRes,
  })
  async getAllGPUs(@Query() queryParams: GetAllProductReq) {
    return this.gpuService.getAllGPUs(queryParams);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new GPU' })
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'The GPU has been successfully created.',
    type: GpuRes,
  })
  async create(@Body() createGpuDto: CreateGpuReq) {
    return this.gpuService.create(createGpuDto);
  }

  @Put('/update')
  @ApiOperation({ summary: 'Update a GPU' })
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The GPU has been successfully updated.',
    type: GpuRes,
  })
  async update(@Body() updateGpuDto: UpdateGpuReq) {
    return this.gpuService.update(updateGpuDto);
  }

  @Get('/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get a GPU by ID' })
  @ApiResponse({
    status: 200,
    description: 'The GPU has been successfully retrieved.',
    type: GpuRes,
  })
  async findById(@Param('id') id: number) {
    return this.gpuService.findById(id);
  }

  @Delete('/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a GPU by ID' })
  @ApiResponse({
    status: 200,
    description: 'The GPU has been successfully deleted.',
  })
  async delete(@Param('id') id: number) {
    return this.gpuService.delete(id);
  }
}
