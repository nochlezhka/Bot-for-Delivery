import { BotCommand } from 'typegram';

import type { UserRoles } from 'pickup-point-db';

const guestCommands: Array<BotCommand> = [
  { command: 'start', description: 'Начать' },
  { command: 'help', description: 'Помощь' },
];

const volunteerCommands: Array<BotCommand> = [
  { command: 'start', description: 'Начать' },
  { command: 'shifts', description: 'Выбрать смены' },
  { command: 'help', description: 'Помощь' },
];

const coordinatorCommands: Array<BotCommand> = [
  { command: 'start', description: 'Начать' },
  { command: 'approve', description: 'Одобрить волонтёра' },
  { command: 'stats', description: 'Статистика' },
  { command: 'help', description: 'Помощь' },
];

const employeeCommands: Array<BotCommand> = [
  { command: 'start', description: 'Начать' },
  { command: 'approve', description: 'Одобрить волонтёра' },
  { command: 'stats', description: 'Статистика' },
  { command: 'help', description: 'Помощь' },
];

export const USER_COMMANDS: Record<UserRoles, Array<BotCommand>> = {
  guest: guestCommands,
  volunteer: volunteerCommands,
  coordinator: coordinatorCommands,
  employee: employeeCommands,
};
export const DEFAULT_COMMANDS = guestCommands;
