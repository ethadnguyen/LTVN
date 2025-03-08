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
import { CoolingService } from '../services/cooling-product.service';
import { CoolingRes } from './types/cooling_types/cooling.res';
import { CreateCoolingReq } from './types/cooling_types/create-cooling.req';
import { UpdateCoolingReq } from './types/cooling_types/update-cooling.req';
import { GetAllProductReq } from './types/get.all.product.req';
import { CoolingListRes } from './types/cooling_types/cooling-list.res';
@Public()
@Controller('cooling')
@ApiTags('Cooling')
export class CoolingController {
  constructor(private readonly coolingService: CoolingService) {}

  @Get('/all')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all cooling products' })
  @ApiResponse({
    status: 200,
    description: 'All cooling products have been successfully retrieved.',
    type: CoolingListRes,
  })
  async getAllCoolingProducts(@Query() queryParams: GetAllProductReq) {
    return await this.coolingService.getAllCoolings(queryParams);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new cooling product' })
  @ApiResponse({
    status: 201,
    description: 'The cooling product has been successfully created.',
    type: CoolingRes,
  })
  async createCooling(@Body() createCoolingDto: CreateCoolingReq) {
    return await this.coolingService.create(createCoolingDto);
  }

  @Put('/update')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a cooling product' })
  @ApiResponse({
    status: 200,
    description: 'The cooling product has been successfully updated.',
    type: CoolingRes,
  })
  async updateCooling(@Body() updateCoolingDto: UpdateCoolingReq) {
    return await this.coolingService.update(updateCoolingDto);
  }

  @Get('/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get a cooling product by ID' })
  @ApiResponse({
    status: 200,
    description: 'The cooling product has been successfully retrieved.',
    type: CoolingRes,
  })
  async getCoolingById(@Param('id') id: number) {
    return await this.coolingService.findById(id);
  }

  @Delete('/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a cooling product by ID' })
  @ApiResponse({
    status: 200,
    description: 'The cooling product has been successfully deleted.',
  })
  async deleteCooling(@Param('id') id: number) {
    return await this.coolingService.delete(id);
  }
}
