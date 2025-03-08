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
import { PsuService } from '../services/psu-product.service';
import { CreatePsuReq } from './types/psu_types/create-psu.req';
import { PsuRes } from './types/psu_types/psu.res';
import { UpdatePsuReq } from './types/psu_types/update-psu.req';
import { GetAllProductReq } from './types/get.all.product.req';
import { PsuListRes } from './types/psu_types/psu-list.res';
@Public()
@ApiTags('PSU')
@Controller('psu')
export class PsuController {
  constructor(private readonly psuService: PsuService) {}

  @Get('/all')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get all PSU with pagination',
    type: PsuListRes,
  })
  async findAll(@Query() queryParams: GetAllProductReq) {
    return this.psuService.getAllPsus(queryParams);
  }

  @Post()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'The PSU has been successfully created.',
    type: PsuRes,
  })
  create(@Body() body: CreatePsuReq) {
    return this.psuService.create(body);
  }

  @Put('/update')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The PSU has been successfully updated.',
    type: PsuRes,
  })
  update(@Body() body: UpdatePsuReq) {
    return this.psuService.update(body);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The PSU has been successfully retrieved.',
    type: PsuRes,
  })
  findById(@Param('id') id: number) {
    return this.psuService.findById(id);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The PSU has been successfully deleted.',
  })
  delete(@Param('id') id: number) {
    return this.psuService.delete(id);
  }
}
