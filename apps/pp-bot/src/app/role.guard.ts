import { CanActivate, ExecutionContext, Injectable, Inject, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from './role.decorator';
import { AppCls } from './app.cls';
import type { UserRoles } from 'pickup-point-db';

@Injectable()
export class RoleGuard implements CanActivate {
  @Inject() private readonly appCls!: AppCls;
   @Inject() private readonly logger!: Logger;
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles | UserRoles[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    this.logger.log("here");
    
    if (!requiredRoles) return true;

    const role = this.appCls.get('user.role');
    if (!role) return false;

    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(role);
    }

    return requiredRoles === role;
  }
}