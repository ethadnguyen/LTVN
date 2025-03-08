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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { MainboardService } from '../services/mainboard-product.service';
import { CreateMainboardReq } from './types/mainboard_types/create-mainboard.req';
import { MainboardRes } from './types/mainboard_types/mainboard.res';
import { UpdateMainboardReq } from './types/mainboard_types/update-mainboard.req';
import { GetAllProductReq } from './types/get.all.product.req';
import { MainboardListRes } from './types/mainboard_types/mainboard-list.res';

@Public()
@Controller('mainboard')
@ApiTags('Mainboard')
export class MainboardController {
  constructor(private readonly mainboardService: MainboardService) {}

  @Get('/all')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all mainboards' })
  @ApiResponse({
    status: 200,
    description: 'The mainboards have been successfully retrieved.',
    type: MainboardListRes,
  })
  async getAllMainboards(@Query() queryParams: GetAllProductReq) {
    return this.mainboardService.getAllMainboards(queryParams);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new mainboard' })
  @ApiResponse({
    status: 201,
    description: 'The mainboard has been successfully created.',
    type: MainboardRes,
  })
  async create(@Body() createMainboardDto: CreateMainboardReq) {
    return this.mainboardService.create(createMainboardDto);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get a mainboard by ID' })
  @ApiResponse({
    status: 200,
    description: 'The mainboard has been successfully retrieved.',
    type: MainboardRes,
  })
  async findById(@Param('id') id: number) {
    return this.mainboardService.findById(id);
  }

  @Put('/update')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a mainboard by ID' })
  @ApiResponse({
    status: 200,
    description: 'The mainboard has been successfully updated.',
    type: MainboardRes,
  })
  async update(@Body() updateMainboardDto: UpdateMainboardReq) {
    return this.mainboardService.update(updateMainboardDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a mainboard by ID' })
  @ApiResponse({
    status: 200,
    description: 'The mainboard has been successfully deleted.',
  })
  async delete(@Param('id') id: number) {
    return this.mainboardService.delete(id);
  }
}
