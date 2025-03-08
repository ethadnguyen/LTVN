import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { UserService } from '../services/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserReq } from './types/create-user.req';
import { UserRes } from './types/user.res';
import { GetAllUserRes } from './types/get.all.user.res';
import { GetAllUserReq } from './types/get.all.user.req';
import { UpdateUserReq } from './types/update-user.req';

@ApiTags('User')
@ApiBearerAuth()
@Public()
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    type: UserRes,
  })
  async create(@Body() body: CreateUserReq) {
    return this.userService.createUser(body);
  }

  @Get('/')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: UserRes,
  })
  async get(@Headers('Authorization') authorization: string) {
    if (!authorization) {
      throw new UnauthorizedException('Token is missing');
    }

    const token = authorization.split(' ')[1];
    const decodedToken = this.jwtService.decode(token);
    const userId = decodedToken.user_id;

    const user = await this.userService.getUserById(userId);

    return user;
  }

  @Get('/all')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: GetAllUserRes,
  })
  async getAllUsers(@Query() queryParams: GetAllUserReq) {
    return await this.userService.getAllUsers(queryParams);
  }

  @Get('/:id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: UserRes,
  })
  async getUserById(@Param('id') id: number) {
    const user = await this.userService.getUserById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  @Put('/update')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: UserRes,
  })
  async update(@Body() body: UpdateUserReq) {
    return this.userService.updateUser(body);
  }

  @Delete('/:id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  async deleteUser(@Param('id') id: number) {
    await this.userService.deleteUserById(id);
    return {
      message: 'User with ID ${id} deleted successfully',
    };
  }
}
