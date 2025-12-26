import { SetMetadata } from '@nestjs/common';
import type { UserRoles } from 'pickup-point-db';
export const ROLE_KEY = 'role';
export const Role = (role: UserRoles | UserRoles[]) => SetMetadata(ROLE_KEY, role);