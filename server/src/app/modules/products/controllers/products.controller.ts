import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  ParseIntPipe,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { ProductService } from '../services/products.service';
import { CreateProductReq } from './types/create-product.req';
import { UpdateProductReq } from './types/update-product.req';
import { ProductRes } from './types/product.res';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductListRes } from './types/product-list.res';
import { GetAllProductReq } from './types/get.all.product.req';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Products')
@Public()
@ApiBearerAuth()
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new product' })
  async create(@Body() createProductReq: CreateProductReq) {
    return this.productService.createProduct(createProductReq);
  }

  @Get('/all')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    type: ProductListRes,
  })
  async getAllProducts(@Query() queryParams: GetAllProductReq) {
    return this.productService.getAllProducts(queryParams);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get product by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getProductById(id);
  }

  @Put('update')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({ type: ProductRes })
  async update(
    @Body() updateProductReq: UpdateProductReq,
  ): Promise<ProductRes> {
    return this.productService.updateProduct(updateProductReq);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete product' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.deleteProduct(id);
  }
}
