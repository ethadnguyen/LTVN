import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CartService } from '../services/cart.service';
import { CartItem } from '../entities/cart-item.entity';
import { CreateCartItemReq } from './types/create-cart-item.req';
import { UpdateCartItemReq } from './types/update-cart-item.req';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('cart')
@ApiTags('Cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly jwtService: JwtService,
  ) {}

  private getUserIdFromToken(authorization: string): number {
    try {
      if (!authorization) {
        throw new UnauthorizedException('No token provided');
      }

      const token = authorization.split(' ')[1];
      const decodedToken = this.jwtService.decode(token);
      console.log(decodedToken);
      return decodedToken.user_id;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Lấy thông tin giỏ hàng của user' })
  @ApiResponse({
    status: 200,
    description:
      'Trả về thông tin giỏ hàng bao gồm danh sách sản phẩm, tổng tiền và số lượng',
  })
  async getCart(@Headers('authorization') authorization: string) {
    const userId = this.getUserIdFromToken(authorization);
    return await this.cartService.getCart(userId);
  }

  @Post('items')
  @ApiOperation({ summary: 'Thêm sản phẩm vào giỏ hàng' })
  @ApiResponse({
    status: 201,
    description: 'Sản phẩm đã được thêm vào giỏ hàng',
    type: CartItem,
  })
  async addToCart(
    @Headers('authorization') authorization: string,
    @Body() createCartItemDto: CreateCartItemReq,
  ): Promise<CartItem> {
    const userId = this.getUserIdFromToken(authorization);
    return await this.cartService.addToCart(userId, createCartItemDto);
  }

  @Put('items')
  @ApiOperation({ summary: 'Cập nhật số lượng sản phẩm trong giỏ hàng' })
  @ApiResponse({
    status: 200,
    description: 'Số lượng sản phẩm đã được cập nhật',
    type: CartItem,
  })
  async updateCartItem(
    @Headers('authorization') authorization: string,
    @Body() updateCartItemDto: UpdateCartItemReq,
  ): Promise<CartItem> {
    const userId = this.getUserIdFromToken(authorization);
    return await this.cartService.updateCartItem(userId, updateCartItemDto);
  }

  @Delete('items/:product_id')
  @ApiOperation({ summary: 'Xóa sản phẩm khỏi giỏ hàng' })
  @ApiResponse({
    status: 200,
    description: 'Sản phẩm đã được xóa khỏi giỏ hàng',
  })
  async removeFromCart(
    @Headers('authorization') authorization: string,
    @Param('product_id', ParseIntPipe) product_id: number,
  ): Promise<void> {
    const userId = this.getUserIdFromToken(authorization);
    await this.cartService.removeFromCart(userId, product_id);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Xóa tất cả sản phẩm trong giỏ hàng' })
  @ApiResponse({
    status: 200,
    description: 'Giỏ hàng đã được làm trống',
  })
  async clearCart(
    @Headers('authorization') authorization: string,
  ): Promise<void> {
    const userId = this.getUserIdFromToken(authorization);
    await this.cartService.clearCart(userId);
  }

  @Delete()
  @ApiOperation({ summary: 'Xóa giỏ hàng' })
  @ApiResponse({
    status: 200,
    description: 'Giỏ hàng đã được xóa hoàn toàn',
  })
  async deleteCart(
    @Headers('authorization') authorization: string,
  ): Promise<void> {
    const userId = this.getUserIdFromToken(authorization);
    await this.cartService.deleteCart(userId);
  }
}
