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
import { RamService } from '../services/ram-product.service';
import { RamRes } from './types/ram_types/ram.res';
import { CreateRamReq } from './types/ram_types/create-ram.req';
import { UpdateRamReq } from './types/ram_types/update-ram.req';
import { GetAllProductReq } from './types/get.all.product.req';
import { RamListRes } from './types/ram_types/ram-list.res';

@Public()
@Controller('ram')
@ApiTags('RAM')
export class RamController {
  constructor(private readonly ramService: RamService) {}

  @Get('/all')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get all RAM with pagination',
    type: RamListRes,
  })
  async findAll(@Query() queryParams: GetAllProductReq) {
    return this.ramService.getAllRams(queryParams);
  }

  @Post()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'The RAM has been successfully created.',
    type: RamRes,
  })
  create(@Body() body: CreateRamReq) {
    return this.ramService.create(body);
  }

  @Put('/update')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The RAM has been successfully updated.',
    type: RamRes,
  })
  update(@Body() body: UpdateRamReq) {
    return this.ramService.update(body);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The RAM has been successfully retrieved.',
    type: RamRes,
  })
  findById(@Param('id') id: number) {
    return this.ramService.findById(id);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The RAM has been successfully deleted.',
  })
  delete(@Param('id') id: number) {
    return this.ramService.delete(id);
  }
}
