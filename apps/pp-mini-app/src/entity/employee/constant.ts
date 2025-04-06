import type { UserRoles } from 'pickup-point-db';

export const ROLE_LIST: Array<UserRoles> = [
  'employee',
  'volunteer',
  'coordinator',
  'guest',
];
export const ROLE_NAMES: Record<UserRoles, string> = {
  employee: 'Сотрудник',
  volunteer: 'Волонтер',
  coordinator: 'Координатор',
  guest: 'Гость',
};
