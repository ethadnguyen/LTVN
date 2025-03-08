import { InvalidatedToken } from 'src/app/modules/invalidated_token/entities/invalidated_token.entity';
import { InvalidatedTokenRepository } from 'src/app/modules/invalidated_token/repositories/invalidated_token.repositories';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
// import { TokenCleanUpService } from 'src/common/services/clean_up_token.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([InvalidatedToken]),
    ScheduleModule.forRoot(),
  ],
  providers: [JwtStrategy, InvalidatedTokenRepository],
})
export class GlobalModule {}
