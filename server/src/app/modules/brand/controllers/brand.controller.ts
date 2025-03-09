import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BrandService } from '../services/brand.service';
import { BrandRes } from './types/brand.res';
import { CreateBrandReq } from './types/create-brand.req';
import { BrandListRes } from './types/brand-list.res';
import { GetAllBrandReq } from './types/get.all.brand.req';
import { UpdateBrandReq } from './types/update-brand.req';
import { Public } from 'src/common/decorators/public.decorator';

@Public()
@Controller('brands')
@ApiTags('Brands')
@ApiBearerAuth()
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo mới hãng sản xuất' })
  @ApiResponse({
    status: 201,
    description: 'Hãng sản xuất đã được tạo thành công',
    type: BrandRes,
  })
  async create(@Body() body: CreateBrandReq) {
    return this.brandService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách hãng sản xuất' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách hãng sản xuất',
    type: BrandListRes,
  })
  async getAllBrands(@Query() query: GetAllBrandReq) {
    return this.brandService.getAllBrands(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin hãng sản xuất theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin hãng sản xuất',
    type: BrandRes,
  })
  async getBrandById(@Param('id', ParseIntPipe) id: number) {
    return this.brandService.findOne(id);
  }

  @Put('/update')
  @ApiOperation({ summary: 'Cập nhật thông tin hãng sản xuất' })
  @ApiResponse({
    status: 200,
    description: 'Hãng sản xuất đã được cập nhật thành công',
    type: BrandRes,
  })
  async updateBrand(@Body() body: UpdateBrandReq) {
    return this.brandService.update(body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa hãng sản xuất' })
  @ApiResponse({
    status: 200,
    description: 'Hãng sản xuất đã được xóa thành công',
  })
  async deleteBrand(@Param('id', ParseIntPipe) id: number) {
    return this.brandService.remove(id);
  }
}
