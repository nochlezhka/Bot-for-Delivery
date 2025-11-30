const guestCommands = [
  { command: 'start', description: 'Начать' },
  { command: 'help', description: 'Помощь' },
];

const volunteerCommands = [
  { command: 'start', description: 'Начать' },
  { command: 'shifts', description: 'Выбрать смены' },
  { command: 'help', description: 'Помощь' },
];

const coordinatorCommands = [
  { command: 'start', description: 'Начать' },
  { command: 'approve', description: 'Одобрить волонтёра' },
  { command: 'stats', description: 'Статистика' },
  { command: 'help', description: 'Помощь' },
];

const employeeCommands = [
  { command: 'start', description: 'Начать' },
  { command: 'approve', description: 'Одобрить волонтёра' },
  { command: 'stats', description: 'Статистика' },
  { command: 'help', description: 'Помощь' },
];


export const COMMANDS = {
  guest: guestCommands,
  volunteer: volunteerCommands,
  coordinator: coordinatorCommands,
  employee: employeeCommands,
  unregistered: guestCommands,
};