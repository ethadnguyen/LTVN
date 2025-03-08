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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { RoleService } from '../services/role.service';
import { GetAllRoleRes } from './types/get.all.role.res';
import { GetAllRoleReq } from './types/get.all.role.req';
import { RoleRes } from './types/role.res';
import { CreateRoleReq } from './types/create.role.req';
import { UpdateRoleReq } from './types/update.role.req';

@ApiTags('Role')
@Public()
@ApiBearerAuth()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('all')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: GetAllRoleRes,
  })
  async GetAllRoles(@Query() queryParams: GetAllRoleReq) {
    return await this.roleService.getAllRoles(queryParams);
  }

  @Get(':name')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: RoleRes,
  })
  async getRole(@Param('name') name: string) {
    return await this.roleService.getRoleByName(name);
  }

  @Post()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    type: RoleRes,
  })
  async createRole(@Body() body: CreateRoleReq) {
    return await this.roleService.createRole(body);
  }

  @Put('update')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: RoleRes,
  })
  async updateRole(@Body() body: UpdateRoleReq) {
    return await this.roleService.updateRole(body);
  }

  @Delete(':name')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Delete role',
  })
  async deleteRole(@Param('name') name: string) {
    return await this.roleService.deleteRole(name);
  }
}
