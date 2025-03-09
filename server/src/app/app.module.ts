import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/config/database/database.module';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { CategoryModule } from './modules/categories/categories.module';
import { ProductModule } from './modules/products/products.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { ReviewModule } from './modules/reviews/review.module';
import { GlobalModule } from 'src/common/global/global.module';
import { AddressModule } from './modules/address/address.module';
import { OrderModule } from './modules/orders/order.module';
import { PromotionModule } from './modules/promotions/promotion.module';
import { CloudinaryModule } from 'src/common/services/upload/cloudinary.module';
import { CartModule } from './modules/cart/cart.module';
import { CompatibilityModule } from './modules/compatibility/compatibility.module';
import { BrandModule } from './modules/brand/brand.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/src/config/env/${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    DatabaseModule,
    GlobalModule,
    PassportModule,
    AuthModule,
    AddressModule,
    UserModule,
    RoleModule,
    PermissionModule,
    CategoryModule,
    ProductModule,
    BrandModule,
    CompatibilityModule,
    OrderModule,
    ReviewModule,
    PromotionModule,
    CartModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
