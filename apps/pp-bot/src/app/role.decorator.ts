import { SetMetadata } from '@nestjs/common';
import { user_role } from 'pickup-point-db/client';

export const ROLE_KEY = 'role';
export const Role = (role: user_role | user_role[]) =>
  SetMetadata(ROLE_KEY, role);
