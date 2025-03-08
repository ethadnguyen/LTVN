import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ReviewController } from './controllers/review.controller';
import { ReviewService } from './services/review.service';
import { Review } from './entities/review.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserRepository } from '../users/repositories/user.repositories';
import { ProductRepository } from '../products/repositories/products.repositories';
import { ReviewRepository } from './repositories/review.repositories';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/products.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([Review, User, Product]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ReviewController],
  providers: [
    ReviewService,
    ReviewRepository,
    UserRepository,
    ProductRepository,
    JwtService,
  ],
})
export class ReviewModule {}
