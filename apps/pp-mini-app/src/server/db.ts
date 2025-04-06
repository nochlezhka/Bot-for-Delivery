import { connectionFactory } from 'pickup-point-db';

export const db: ReturnType<typeof connectionFactory> = connectionFactory(
  process.env['DATABASE_URL'] ?? ''
);
