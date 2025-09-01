import { drizzle } from 'drizzle-orm/node-postgres';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Pool } from 'pg';

import * as schema from './schema';

export const connectionFactory = (connectionString: string) => {
  const pool = new Pool({
    connectionString,
  });
  return drizzle(pool, { schema });
};

export { schema };

export type User = typeof schema.userTable.$inferSelect;
export type NewUser = typeof schema.userTable.$inferInsert;
export type UserRoles = (typeof schema.userRoleEnum.enumValues)[number];
export type Gender = (typeof schema.userGender.enumValues)[number];
export type ShiftStatus = (typeof schema.shiftStatusEnum.enumValues)[number];
