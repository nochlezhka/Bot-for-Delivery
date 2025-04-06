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

export type UserRoles = (typeof schema.userRoleEnum.enumValues)[number];
export type ShiftStatus = (typeof schema.shiftStatusEnum.enumValues)[number];
