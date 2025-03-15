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
  Put,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderService } from '../services/order.service';
import { Public } from 'src/common/decorators/public.decorator';
import { GetAllOrderReq } from './types/get.all.order.req';
import { OrderListRes } from './types/order-list.res';
import { OrderRes } from './types/order.res';
import { CreateOrderReq } from './types/create-order.req';
import { UpdateOrderReq } from './types/update-order.req';
import { OrderStatus } from '../enums/order-status.enum';

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
      const { userId } = this.orderService.getUserFromToken(authorization);
      if (userId) {
        body.user_id = userId;
      }
    } catch (error) {
      console.log('Creating order without user_id');
    }

    return this.orderService.createOrder(body);
  }

  @Put('/update')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Update order status',
    type: OrderRes,
  })
  async updateOrder(
    @Body() body: UpdateOrderReq,
    @Headers('authorization') authorization: string,
  ) {
    try {
      const { userId, roles } =
        this.orderService.getUserFromToken(authorization);
      const order = await this.orderService.getOrderById(body.id);

      const isAdmin = roles.includes('admin');
      const isOwner = order.user_id === userId;

      if (!isAdmin && !isOwner) {
        throw new UnauthorizedException(
          'Bạn không có quyền cập nhật đơn hàng này',
        );
      }

      if (!body.status) {
        body.status = order.status;
      }

      const updateData = {
        id: body.id,
        ...body,
        status: body.status,
      };

      return this.orderService.updateOrder(updateData);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Không thể cập nhật đơn hàng');
    }
  }

  @Delete('/:id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Delete an order',
  })
  async deleteOrder(
    @Param('id') id: number,
    @Headers('authorization') authorization: string,
  ) {
    try {
      const { userId, roles } =
        this.orderService.getUserFromToken(authorization);
      const order = await this.orderService.getOrderById(id);

      const isAdmin = roles.includes('admin');
      const isOwner = order.user_id === userId;

      if (!isAdmin && !isOwner) {
        throw new UnauthorizedException('Bạn không có quyền xóa đơn hàng này');
      }

      if (isAdmin) {
        if (
          order.status !== OrderStatus.PENDING &&
          order.status !== OrderStatus.SHIPPING
        ) {
          throw new UnauthorizedException(
            'Admin chỉ có thể xóa đơn hàng ở trạng thái chờ xử lý hoặc đang giao hàng',
          );
        }
      } else {
        if (order.status !== OrderStatus.PENDING) {
          throw new UnauthorizedException(
            'Chỉ có thể xóa đơn hàng ở trạng thái chờ xử lý',
          );
        }
      }

      await this.orderService.deleteOrder(id);
      return { message: 'Đã xóa đơn hàng thành công' };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Không thể xóa đơn hàng');
    }
  }
}
