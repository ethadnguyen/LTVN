import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.DEFAULT })
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async findById(id: number) {
    return this.repo.findOne({
      where: { user_id: id },
      relations: ['role', 'role.permissions'],
    });
  }

  async findByEmail(email: string) {
    return this.repo.findOne({
      where: { email },
      relations: ['role', 'role.permissions'],
    });
  }

  async findAll(paginationOptions: {
    skip: number;
    take: number;
  }): Promise<[User[], number]> {
    const [users, total] = await this.repo.findAndCount({
      skip: paginationOptions.skip,
      take: paginationOptions.take,
      relations: ['role', 'role.permissions'],
    });

    return [users, total];
  }

  async create(user: User) {
    const userDb = await this.repo.save(user);
    return await this.findById(userDb.user_id);
  }

  async isUserTableEmpty(): Promise<boolean> {
    const count = await this.repo.count();
    return count === 0;
  }

  async update(updateData: Partial<User>): Promise<User> {
    await this.repo.save(updateData);
    return this.repo.findOne({
      where: { user_id: updateData.user_id },
      relations: ['role', 'role.permissions'],
    });
  }

  async delete(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new Error(`User with id ${id} not found`);
    }
  }
}
