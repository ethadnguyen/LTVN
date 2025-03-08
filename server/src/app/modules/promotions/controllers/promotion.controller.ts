import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { PromotionService } from '../services/promotion.service';
import { GetAllPromotionReq } from './types/get.all.promotion.req';
import { CreatePromotionReq } from './types/create-promotion.req';
import { UpdatePromotionReq } from './types/update-promotion.req';
import { PromotionListRes } from './types/promotion-list.res';
import { PromotionRes } from './types/promotion.res';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('promotions')
@ApiTags('Promotions')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Public()
  @Get('/all')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách khuyến mãi',
    type: PromotionListRes,
  })
  async findAllPromotions(@Query() query: GetAllPromotionReq) {
    return this.promotionService.findAllPromotions(query);
  }

  @Public()
  @Get(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin chi tiết khuyến mãi',
    type: PromotionRes,
  })
  async getPromotionById(@Param('id') id: number) {
    return this.promotionService.getPromotionById(id);
  }

  @Post()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Tạo khuyến mãi mới',
    type: PromotionRes,
  })
  async createPromotion(@Body() body: CreatePromotionReq) {
    return this.promotionService.createPromotion(body);
  }

  @Put('/update')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Cập nhật khuyến mãi',
    type: PromotionRes,
  })
  async updatePromotion(@Body() body: UpdatePromotionReq) {
    return this.promotionService.updatePromotion(body);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Xóa khuyến mãi',
  })
  async deletePromotion(@Param('id') id: number) {
    return this.promotionService.deletePromotion(id);
  }
}
