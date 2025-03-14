import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderService } from '../services/order.service';
import { Public } from 'src/common/decorators/public.decorator';
import { GetAllOrderReq } from './types/get.all.order.req';
import { OrderListRes } from './types/order-list.res';
import { OrderRes } from './types/order.res';
import { CreateOrderReq } from './types/create-order.req';

@Controller('orders')
@ApiTags('Orders')
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Public()
  @Get('/all')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get all orders',
    type: OrderListRes,
  })
  async getAllOrders(@Query() queryParams: GetAllOrderReq) {
    return this.orderService.getAllOrders(queryParams);
  }

  @Public()
  @Get('/:id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get order by id',
    type: OrderRes,
  })
  async getOrderById(@Param('id') id: number) {
    return this.orderService.getOrderById(id);
  }

  @Post('')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Create a new order',
    type: OrderRes,
  })
  async createOrder(
    @Headers('authorization') authorization: string,
    @Body() body: CreateOrderReq,
  ) {
    try {
      const userId = this.orderService.getUserIdFromToken(authorization);
      if (userId) {
        body.user_id = userId;
      }
    } catch (error) {
      console.log('Creating order without user_id');
    }

    return this.orderService.createOrder(body);
  }
}
