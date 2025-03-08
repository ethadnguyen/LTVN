import { BadRequestException, Injectable, Scope } from '@nestjs/common';
import { PermissionRepository } from '../repositories/permission.repositories';
import { GetAllPermissionInput } from './types/get.all.permission.input';
import { ErrorMessage } from 'src/common/enum/error.message.enum';
import { UpdatePermissionInput } from './types/update.permission.input';
import { Permission } from '../entities/permission.entity';
import { CreatePermissionInput } from './types/create.permission.input';

@Injectable({ scope: Scope.DEFAULT })
export class PermissionService {
  constructor(private readonly permissionRepo: PermissionRepository) {}

  async getAllPermissions(queryParams: GetAllPermissionInput) {
    const { page = 1, size = 10 } = queryParams;

    const [permissions, total] = await this.permissionRepo.findAll({
      skip: (page - 1) * size,
      take: size,
    });

    const totalPages = Math.ceil(total / size);

    return {
      total,
      totalPages,
      currentPage: page,
      permissions,
    };
  }

  async getPermissionById(id: number) {
    const permission = this.permissionRepo.findById(id);

    if (permission) {
      return permission;
    }

    throw new BadRequestException(ErrorMessage.PERMISSION_NOT_FOUND);
  }

  async createPermission(input: CreatePermissionInput) {
    const permission = await this.permissionRepo.findByName(input.name);
    if (permission) {
      throw new Error(ErrorMessage.PERMISSION_EXISTS);
    } else {
      const newPermission = new Permission();

      newPermission.name = input.name;
      newPermission.description = input.description;

      return await this.permissionRepo.create(newPermission);
    }
  }

  async updatePermission(input: UpdatePermissionInput) {
    const permission = await this.permissionRepo.findById(input.id);
    const findNamePermission = await this.permissionRepo.findByName(input.name);

    if (permission) {
      if (!findNamePermission || findNamePermission.name === input.name) {
        permission.name = input.name;
        permission.description = input.description;

        return await this.permissionRepo.update(permission.id, {
          id: permission.id,
          name: permission.name,
          description: permission.description,
        });
      }
    } else {
      throw new BadRequestException(ErrorMessage.PERMISSION_EXISTS);
    }

    throw new BadRequestException(ErrorMessage.PERMISSION_NOT_FOUND);
  }

  async deletePermission(id: number) {
    const permission = await this.permissionRepo.findById(id);

    if (permission) {
      this.permissionRepo.delete(id);
    }

    throw new BadRequestException(ErrorMessage.PERMISSION_NOT_FOUND);
  }
}
