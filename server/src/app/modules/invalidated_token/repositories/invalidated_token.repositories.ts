import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvalidatedToken } from '../entities/invalidated_token.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.DEFAULT })
export class InvalidatedTokenRepository {
  constructor(
    @InjectRepository(InvalidatedToken)
    private repo: Repository<InvalidatedToken>,
  ) {}

  async create(invalidatedToken: InvalidatedToken): Promise<InvalidatedToken> {
    const invalidToken = await this.repo.save(invalidatedToken);
    return invalidToken;
  }

  async findAll() {
    return this.repo.find();
  }

  async findById(tokenId: string) {
    return this.repo.findOne({
      where: { id: tokenId },
    });
  }

  async deleteExpiredTokens(currentDate: Date) {
    const result = await this.repo
      .createQueryBuilder()
      .delete()
      .where('expiry_time < :currentDate', { currentDate })
      .execute();

    return result;
  }
}
