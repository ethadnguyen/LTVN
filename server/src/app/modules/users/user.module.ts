import { Module } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './repositories/user.repositories';
import { RoleRepository } from '../role/repositories/role.repositories';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: `${configService.get('JWT_SECRET')}`,
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, JwtService, RoleRepository],
  exports: [UserRepository, JwtService, UserService],
})
export class UserModule {}
