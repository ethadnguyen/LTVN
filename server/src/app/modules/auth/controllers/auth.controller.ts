import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginRes } from './types/login.res';
import { LoginReq } from './types/login.req';
import { RefreshTokenRes } from './types/refresh_token.res';
import { RefreshTokenReq } from './types/refresh_token.req';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: LoginRes,
  })
  async login(@Body() request: LoginReq) {
    return await this.authService.validate(request);
  }

  @Post('logout')
  @HttpCode(200)
  @ApiResponse({
    status: 204,
  })
  async logout(@Headers('Authorization') authorization: string) {
    if (!authorization) {
      throw new UnauthorizedException('Token is missing');
    }

    const token = authorization.split(' ')[1];
    this.authService.logout(token);
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: RefreshTokenRes,
  })
  async refresh(@Body() request: RefreshTokenReq) {
    return await this.authService.refresh(request.refresh_token);
  }
}
