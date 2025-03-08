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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { CpuService } from '../services/cpu-product.service';
import { CreateCpuReq } from './types/cpu_types/create-cpu.req';
import { CpuRes } from './types/cpu_types/cpu.res';
import { UpdateCpuReq } from './types/cpu_types/update-cpu.req';
import { GetAllProductReq } from './types/get.all.product.req';
import { CpuListRes } from './types/cpu_types/cpu-list.res';
@Public()
@ApiTags('CPU')
@Controller('cpu')
export class CpuController {
  constructor(private readonly cpuService: CpuService) {}

  @Get('all')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The CPU has been successfully retrieved.',
    type: CpuListRes,
  })
  findAll(@Query() queryParams: GetAllProductReq) {
    return this.cpuService.getAllCPUs(queryParams);
  }

  @Post()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'The CPU has been successfully created.',
    type: CpuRes,
  })
  create(@Body() body: CreateCpuReq) {
    return this.cpuService.create(body);
  }

  @Put('/update')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The CPU has been successfully updated.',
    type: CpuRes,
  })
  update(@Body() body: UpdateCpuReq) {
    return this.cpuService.update(body);
  }

  @Get('/:id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The CPU has been successfully retrieved.',
    type: CpuRes,
  })
  findById(@Param('id') id: number) {
    return this.cpuService.findById(id);
  }

  @Delete('/:id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The CPU has been successfully deleted.',
  })
  delete(@Param('id') id: number) {
    return this.cpuService.delete(id);
  }
}
