import { endOfMonth } from 'date-fns/endOfMonth';
import { startOfDay } from 'date-fns/startOfDay';
import { startOfMonth } from 'date-fns/startOfMonth';
import { and, asc, between, eq, gte, isNotNull } from 'drizzle-orm/expressions';
import { connectionFactory, schema, ShiftStatus } from 'pickup-point-db';

import { shiftKeyByDate } from '@/entity/shift/util';

export const getCalendarShifts = async (
  db: ReturnType<typeof connectionFactory>,
  {
    dateStart,
    dateEnd,
    userId,
  }: {
    dateStart?: Date;
    dateEnd?: Date;
    userId: string;
  }
) => {
  const currentDate = new Date();
  const data = await db
    .select()
    .from(schema.shiftTable)
    .leftJoin(
      schema.userShiftsTable,
      eq(schema.shiftTable.id, schema.userShiftsTable.shiftId)
    )
    .where(
      between(
        schema.shiftTable.dateStart,
        dateStart ?? startOfMonth(currentDate),
        dateEnd ?? endOfMonth(currentDate)
      )
    );
  return Array.from(
    data
      .reduce(
        (acc, { shift: { id, status, dateStart }, user_shifts_table }) => {
          const key = shiftKeyByDate(dateStart);
          const shift = acc.get(key) ?? {
            id,
            dateStart,
            status,
          };
          if (user_shifts_table && userId === user_shifts_table.userId) {
            shift.accepted = user_shifts_table.status;
          }
          acc.set(key, shift);
          return acc;
        },
        new Map<
          number,
          {
            id: string;
            status: ShiftStatus;
            dateStart: Date;
            accepted?: boolean | null;
          }
        >()
      )
      .entries()
  );
};

export const getOwnShiftList = async (
  db: ReturnType<typeof connectionFactory>,
  {
    userId,
  }: {
    userId: string;
  }
) => {
  const currentDate = new Date();
  const data = await db
    .select()
    .from(schema.shiftTable)
    .leftJoin(
      schema.userShiftsTable,
      eq(schema.shiftTable.id, schema.userShiftsTable.shiftId)
    )
    .where(
      and(
        gte(schema.shiftTable.dateStart, startOfDay(currentDate)),
        eq(schema.userShiftsTable.userId, userId),
        isNotNull(schema.userShiftsTable.status)
      )
    )
    .orderBy(asc(schema.shiftTable.dateStart));
  return Array.from(
    data
      .reduce(
        (acc, { shift: { id, status, dateStart }, user_shifts_table }) => {
          const shift = acc.get(id) ?? {
            status,
            dateStart,
          };
          if (user_shifts_table && userId === user_shifts_table.userId) {
            shift.accepted = user_shifts_table.status;
          }
          acc.set(id, shift);
          return acc;
        },
        new Map<
          string,
          {
            dateStart: Date;
            status: ShiftStatus;
            accepted?: boolean | null;
          }
        >()
      )
      .entries()
  );
};

type ShiftsWithUsers = {
  shift: typeof schema.shiftTable.$inferSelect;
  userShift: typeof schema.userShiftsTable.$inferSelect | null;
}[];
const castShiftsArrayToShift = (res: ShiftsWithUsers) => {
  const result = res.reduce(
    (acc, { shift, userShift }) => {
      const cur = acc.get(shift.id) ?? {
        ...shift,
        users: {} as Record<string, boolean | null>,
      };
      if (userShift) {
        cur.users[userShift.userId] = userShift.status;
      }
      acc.set(shift.id, cur);
      return acc;
    },
    new Map<
      string,
      typeof schema.shiftTable.$inferSelect & {
        users: Record<string, boolean | null>;
      }
    >()
  );
  const vals = Array.from(result.values());
  return vals.length > 0 ? vals[0] : null;
};
export const shiftByDates = (
  db: ReturnType<typeof connectionFactory>,
  {
    dateStart,
    dateEnd,
  }: {
    dateStart: Date;
    dateEnd: Date;
  }
) =>
  db
    .select({
      shift: schema.shiftTable,
      userShift: schema.userShiftsTable,
    })
    .from(schema.shiftTable)
    .leftJoin(
      schema.userShiftsTable,
      eq(schema.shiftTable.id, schema.userShiftsTable.shiftId)
    )
    .where(({ shift }) =>
      and(eq(shift.dateStart, dateStart), eq(shift.dateEnd, dateEnd))
    )
    .execute()
    .then(castShiftsArrayToShift);

type UsersShiftsWithUsers = {
  shift: typeof schema.shiftTable.$inferSelect | null;
  userShift: typeof schema.userShiftsTable.$inferSelect;
}[];
const castUsersShiftsArrayToShift = (res: UsersShiftsWithUsers) => {
  const result = res.reduce(
    (acc, { shift, userShift }) => {
      if (shift) {
        const cur = acc.get(shift.id) ?? {
          ...shift,
          users: {} as Record<string, boolean | null>,
        };
        if (userShift) {
          cur.users[userShift.userId] = userShift.status;
        }
        acc.set(shift.id, cur);
      }
      return acc;
    },
    new Map<
      string,
      typeof schema.shiftTable.$inferSelect & {
        users: Record<string, boolean | null>;
      }
    >()
  );
  const vals = Array.from(result.values());
  return vals.length > 0 ? vals[0] : null;
};
export const shiftByIdAndUser = (
  db: ReturnType<typeof connectionFactory>,
  {
    id,
    userId,
  }: {
    id: string;
    userId: string;
  }
) =>
  db
    .select({
      shift: schema.shiftTable,
      userShift: schema.userShiftsTable,
    })
    .from(schema.userShiftsTable)
    .leftJoin(
      schema.shiftTable,
      eq(schema.userShiftsTable.shiftId, schema.shiftTable.id)
    )
    .where(({ userShift }) =>
      and(eq(userShift.shiftId, id), eq(userShift.userId, userId))
    )
    .execute()
    .then(castUsersShiftsArrayToShift);
