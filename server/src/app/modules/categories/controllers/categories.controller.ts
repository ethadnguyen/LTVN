import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CategoryService } from '../services/categories.service';
import { CreateCategoryReq } from './types/create-category.req';
import { UpdateCategoryReq } from './types/update-category.req';
import { CategoryRes } from './types/category.res';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GetAllCategoriesRes } from './types/get.all.categoires.res';
import { Public } from 'src/common/decorators/public.decorator';
import { GetAllCategoriesReq } from './types/get.all.categories.req';

@ApiTags('Categories')
@Public()
@ApiBearerAuth()
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    type: CategoryRes,
  })
  async create(
    @Body() createCategoryReq: CreateCategoryReq,
  ): Promise<CategoryRes> {
    return this.categoryService.create(createCategoryReq);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    type: GetAllCategoriesRes,
  })
  async getAllCategories(@Query() queryParams: GetAllCategoriesReq) {
    return this.categoryService.getAllCategories(queryParams);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiResponse({
    status: 200,
    type: CategoryRes,
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CategoryRes> {
    return this.categoryService.findById(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get category by slug' })
  @ApiResponse({
    status: 200,
    type: CategoryRes,
  })
  async findBySlug(@Param('slug') slug: string): Promise<CategoryRes> {
    return this.categoryService.findBySlug(slug);
  }

  @Put('update')
  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({
    status: 200,
    type: CategoryRes,
  })
  async update(
    @Body() updateCategoryReq: UpdateCategoryReq,
  ): Promise<CategoryRes> {
    return this.categoryService.update(updateCategoryReq.id, updateCategoryReq);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete category',
  })
  @ApiResponse({
    status: 200,
    description: 'Category deleted successfully',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoryService.delete(id);
  }
}
