import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoleRepository } from '../repositories/role.repositories';
import { PermissionRepository } from '../../permission/repositories/permission.repositories';
import { PaginationInput } from 'src/common/types/pagination_types/pagination.input';
import { ErrorMessage } from 'src/common/enum/error.message.enum';
import { CreateRoleInput } from './types/create-role.input';
import { Role } from '../entities/role.entity';
import { UpdateRoleInput } from './types/update-role.input';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepo: RoleRepository,
    private readonly permissionRepo: PermissionRepository,
  ) {}

  async getAllRoles(queryParams: PaginationInput) {
    const { page = 1, size = 10 } = queryParams;

    const [roles, total] = await this.roleRepo.findAll({
      skip: (page - 1) * size,
      take: size,
    });

    const totalPages = Math.ceil(total / size);

    return {
      total,
      totalPages,
      currentPage: page,
      roles,
    };
  }

  async getRoleByName(name: string) {
    const role = await this.roleRepo.findByName(name);
    if (!role) {
      throw new NotFoundException(ErrorMessage.ROLE_NOT_FOUND);
    }

    return role;
  }

  async createRole(input: CreateRoleInput) {
    const existingRole = await this.roleRepo.findByName(input.name);

    if (existingRole) {
      throw new BadRequestException(ErrorMessage.ROLE_EXISTS);
    }

    const role = new Role();

    role.name = input.name;
    role.description = input.description;

    if (input.permission_ids?.length) {
      const permissions = await Promise.all(
        input.permission_ids.map((id) => this.permissionRepo.findById(id)),
      );

      if (permissions.some((p) => !p)) {
        throw new BadRequestException('Some permissions do not exist');
      }

      role.permissions = permissions.filter((p) => p !== null);
    }

    return await this.roleRepo.create(role);
  }

  async updateRole(input: UpdateRoleInput) {
    const role = await this.roleRepo.findByName(input.name);

    if (!role) {
      throw new NotFoundException(ErrorMessage.ROLE_NOT_FOUND);
    }

    if (input.description) {
      role.description = input.description;
    }

    if (input.permission_ids) {
      const permissions = await Promise.all(
        input.permission_ids.map((id) => this.permissionRepo.findById(id)),
      );

      if (permissions.some((p) => !p)) {
        throw new BadRequestException('Some permissions do not exist');
      }

      role.permissions = permissions.filter((p) => p !== null);
    }

    const updatedRole = await this.roleRepo.update(role);
    return updatedRole;
  }

  async deleteRole(name: string) {
    const role = await this.roleRepo.findByName(name);

    if (!role) {
      throw new NotFoundException(ErrorMessage.ROLE_NOT_FOUND);
    }

    await this.roleRepo.delete(name);
  }
}
