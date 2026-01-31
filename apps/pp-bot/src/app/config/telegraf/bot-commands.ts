import { user_role } from 'pickup-point-db/client';
import { BotCommand } from 'typegram';

const guestCommands: Array<BotCommand> = [
  { command: 'start', description: 'Начать' },
  { command: 'help', description: 'Помощь' },
];

const volunteerCommands: Array<BotCommand> = [
  { command: 'start', description: 'Начать' },
  { command: 'select_shifts', description: 'Выбрать смены' },
  { command: 'help', description: 'Помощь' },
];

const coordinatorCommands: Array<BotCommand> = [
  { command: 'start', description: 'Начать' },
  { command: 'select_shifts', description: 'Выбрать смены' },
  { command: 'approve', description: 'Одобрить волонтёра' },
  { command: 'stats', description: 'Статистика' },
  { command: 'help', description: 'Помощь' },
];

const employeeCommands: Array<BotCommand> = [
  { command: 'start', description: 'Начать' },
  { command: 'select_shifts', description: 'Выбрать смены' },
  { command: 'approve', description: 'Одобрить волонтёра' },
  { command: 'stats', description: 'Статистика' },
  { command: 'help', description: 'Помощь' },
];

export const USER_COMMANDS: Record<user_role, Array<BotCommand>> = {
  guest: guestCommands,
  volunteer: volunteerCommands,
  coordinator: coordinatorCommands,
  employee: employeeCommands,
};
export const DEFAULT_COMMANDS = guestCommands;
