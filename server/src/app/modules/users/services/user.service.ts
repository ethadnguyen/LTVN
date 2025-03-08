import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repositories';
import { RoleRepository } from '../../role/repositories/role.repositories';
import { CreateUserInput } from './types/create-user.input';
import { User } from '../entities/user.entity';
import { hash } from 'bcrypt';
import { ErrorMessage } from 'src/common/enum/error.message.enum';
import { PaginationInput } from 'src/common/types/pagination_types/pagination.input';
import { UpdateUserInput } from './types/update-user.input';
import { validatePhoneNumber } from './../../../../common/helpers/index';

@Injectable({ scope: Scope.DEFAULT })
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly roleRepo: RoleRepository,
  ) {}

  async createUser(input: CreateUserInput) {
    let user = new User();

    let userDb = await this.userRepo.findByEmail(input.email);

    if (userDb) {
      throw new BadRequestException(ErrorMessage.EMAIL_EXISTS);
    }

    user.user_name = input.user_name;
    if (!validatePhoneNumber(input.phone)) {
      throw new BadRequestException(ErrorMessage.PHONE_INVALID);
    }

    user.phone = input.phone;
    user.email = input.email;
    user.status = input.status;
    user.password = await hash(input.password, 12);

    if (input.roles && input.roles.length > 0) {
      const foundRoles = await this.roleRepo.findByNames(input.roles);
      user.role = foundRoles;
    } else {
      const defaultRole = await this.roleRepo.getDefaultRole();
      user.role = [defaultRole];
    }

    return await this.userRepo.create(user);
  }

  async getUserById(id: number) {
    let userDb = await this.userRepo.findById(id);
    if (!userDb) {
      throw new BadRequestException(ErrorMessage.USER_NOT_FOUND);
    }
    return userDb;
  }

  async getAllUsers(queryParams: PaginationInput) {
    const { page = 1, size = 10 } = queryParams;

    const [users, total] = await this.userRepo.findAll({
      skip: (page - 1) * size,
      take: size,
    });

    const totalPages = Math.ceil(total / size);

    return {
      total,
      totalPages,
      currentPage: page,
      users,
    };
  }

  async updateUser(input: UpdateUserInput) {
    const user = await this.getUserById(input.user_id);

    if (!user) {
      throw new NotFoundException(ErrorMessage.DATA_NOT_FOUND);
    }

    if (input.email && input.email !== user.email) {
      const emailExists = await this.userRepo.findByEmail(input.email);
      if (emailExists) {
        throw new BadRequestException(ErrorMessage.EMAIL_EXISTS);
      }

      user.email = input.email;
    }

    user.user_name = input.user_name;
    user.phone = input.phone;

    if (input.password) {
      user.password = await hash(input.password, 12);
    }

    user.status = input.status;

    if (input.roles && input.roles.length > 0) {
      const foundRoles = await this.roleRepo.findByNames(input.roles);
      user.role = foundRoles;
    }

    const updatedUser = await this.userRepo.update(user);
    return updatedUser;
  }

  async deleteUserById(id: number) {
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ${id} not found`);
    }

    return await this.userRepo.delete(id);
  }
}
