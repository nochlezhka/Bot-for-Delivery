import type { user_role } from 'pickup-point-db/client';

export const ROLE_LIST: Array<user_role> = [
  'employee',
  'volunteer',
  'coordinator',
  'guest',
];
export const ROLE_NAMES: Record<user_role, string> = {
  coordinator: 'Координатор',
  employee: 'Сотрудник',
  guest: 'Гость',
  volunteer: 'Волонтер',
};
