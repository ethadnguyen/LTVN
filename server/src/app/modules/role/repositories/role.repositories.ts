import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { In, Repository } from 'typeorm';

@Injectable({ scope: Scope.DEFAULT })
export class RoleRepository {
  constructor(
    @InjectRepository(Role)
    private repo: Repository<Role>,
  ) {}

  async findAll(paginationOptions: {
    skip: number;
    take: number;
  }): Promise<[Role[], number]> {
    return await this.repo.findAndCount({
      skip: paginationOptions.skip,
      take: paginationOptions.take,
      relations: ['permissions'],
    });
  }

  async isRoleTableEmpty(): Promise<boolean> {
    const count = await this.repo.count();
    return count === 0;
  }

  async create(role: Role) {
    const newRole = await this.repo.save(role);
    return newRole;
  }

  async update(role: Role) {
    const existingRole = await this.findByName(role.name);

    if (existingRole) {
      await this.repo
        .createQueryBuilder()
        .relation(Role, 'permissions')
        .of(existingRole)
        .remove(existingRole.permissions);

      Object.assign(existingRole, role);
      return await this.repo.save(existingRole);
    }

    return null;
  }

  async findByName(name: string) {
    return await this.repo.findOne({
      where: { name },
      relations: ['permissions'],
    });
  }

  async findByNames(names: string[]) {
    return this.repo.find({
      where: {
        name: In(names),
      },
    });
  }

  async getDefaultRole() {
    return this.repo.findOne({
      where: {
        name: 'NORMAL',
      },
    });
  }

  async delete(name: string) {
    await this.repo.delete({ name });
  }
}
