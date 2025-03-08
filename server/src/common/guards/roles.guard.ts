import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user?.roles || user.roles.length === 0) {
      throw new UnauthorizedException('User does not have any roles assigned.');
    }

    const hasRole = user.roles.some((userRole: string) =>
      requiredRoles.includes(userRole),
    );

    if (!hasRole) {
      throw new UnauthorizedException('User does not have the required roles.');
    }

    return hasRole;
  }
}
