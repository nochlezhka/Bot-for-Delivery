import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { user_role } from 'pickup-point-db/client';

import { AppCls } from './app.cls';
import { ROLE_KEY } from './role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  @Inject() private readonly appCls!: AppCls;
  @Inject() private reflector!: Reflector;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<
      user_role | user_role[] | undefined
    >(ROLE_KEY, [context.getHandler(), context.getClass()]);
    let result = true;

    if (requiredRoles) {
      const userRole = this.appCls.get('user.role');

      if (userRole) {
        if (Array.isArray(requiredRoles)) {
          result = requiredRoles.includes(userRole);
        } else {
          result = requiredRoles === userRole;
        }
      } else {
        result = false;
      }
    }

    return result;
  }
}
