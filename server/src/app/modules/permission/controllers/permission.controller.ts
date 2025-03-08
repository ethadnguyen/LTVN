import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { PermissionService } from '../services/permission.service';
import { GetAllPermissionRes } from './types/get.all.permission.res';
import { GetAllPermissionReq } from './types/get.all.permission.req';
import { CreatePermissionReq } from './types/create.permission.req';
import { UpdatePermissionReq } from './types/update.permission.req';

@Public()
@ApiTags('permission')
@Controller('permission')
@ApiBearerAuth()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get('all')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: GetAllPermissionRes,
  })
  async getAllPermissions(@Query() query: GetAllPermissionReq) {
    return await this.permissionService.getAllPermissions(query);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: GetAllPermissionRes,
  })
  async getPermissionById(@Query('id') id: number) {
    return await this.permissionService.getPermissionById(id);
  }

  @Post('/')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    type: GetAllPermissionRes,
  })
  async createPermission(@Body() body: CreatePermissionReq) {
    return await this.permissionService.createPermission(body);
  }

  @Put('update')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: GetAllPermissionRes,
  })
  async updatePermission(@Body() body: UpdatePermissionReq) {
    return await this.permissionService.updatePermission(body);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    type: GetAllPermissionRes,
  })
  async deletePermission(@Param('id', ParseIntPipe) id: number) {
    return await this.permissionService.deletePermission(id);
  }
}
