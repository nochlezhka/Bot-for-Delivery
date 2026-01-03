import { endOfMonth } from 'date-fns/endOfMonth';
import { startOfDay } from 'date-fns/startOfDay';
import { startOfMonth } from 'date-fns/startOfMonth';
import { shift, shift_status } from 'pickup-point-db/browser';
import { shiftGetPayload } from 'pickup-point-db/models';

import { shiftKeyByDate } from '@/entity/shift/util';
import { prisma } from '@/server/db';

export const getCalendarShifts = async ({
  dateStart,
  dateEnd,
  userId,
}: {
  dateStart?: Date;
  dateEnd?: Date;
  userId: string;
}) => {
  const currentDate = new Date();
  const data = await prisma.shift.findMany({
    select: {
      id: true,
      status: true,
      date_start: true,
      user_shifts_table: true,
    },
    where: {
      date_start: {
        gte: dateStart ?? startOfMonth(currentDate),
      },
      date_end: {
        lt: dateEnd ?? endOfMonth(currentDate),
      },
    },
  });
  return Array.from(
    data
      .reduce(
        (acc, { id, status, date_start: dateStart, user_shifts_table }) => {
          const key = shiftKeyByDate(dateStart);
          const shift = acc.get(key) ?? {
            id,
            dateStart,
            status,
          };
          for (const userShift of user_shifts_table) {
            if (userId === userShift.user_id) {
              shift.accepted = userShift.status;
              break;
            }
          }

          acc.set(key, shift);
          return acc;
        },
        new Map<
          number,
          {
            id: string;
            status: shift_status;
            dateStart: Date;
            accepted?: boolean | null;
          }
        >()
      )
      .entries()
  );
};

export const getOwnShiftList = async ({ userId }: { userId: string }) => {
  const currentDate = new Date();
  const data = await prisma.shift.findMany({
    select: {
      id: true,
      status: true,
      date_start: true,
      user_shifts_table: true,
    },
    where: {
      date_start: {
        gte: startOfDay(currentDate),
      },
      user_shifts_table: {
        every: {
          user_id: userId,
          status: { not: null },
        },
      },
    },
    orderBy: {
      date_start: 'asc',
    },
  });
  return Array.from(
    data
      .reduce(
        (acc, { id, status, date_start: dateStart, user_shifts_table }) => {
          const shift = acc.get(id) ?? {
            status,
            dateStart,
          };
          for (const userShift of user_shifts_table) {
            if (userId === userShift.user_id) {
              shift.accepted = userShift.status;
              break;
            }
          }
          acc.set(id, shift);
          return acc;
        },
        new Map<
          string,
          {
            dateStart: Date;
            status: shift_status;
            accepted?: boolean | null;
          }
        >()
      )
      .entries()
  );
};

export const shiftByDates = async ({
  dateStart,
  dateEnd,
}: {
  dateStart: Date;
  dateEnd: Date;
}) => {
  const res = await prisma.shift.findMany({
    where: {
      date_start: {
        gte: dateStart,
      },
      date_end: {
        lt: dateEnd,
      },
    },
    include: {
      user_shifts_table: {
        select: {
          user_id: true,
          status: true,
        },
      },
    },
  });

  const result = res.reduce(
    (acc, { user_shifts_table, ...shift }) => {
      const cur = acc.get(shift.id) ?? {
        ...shift,
        users: {} as Record<string, boolean | null>,
      };

      for (const userShift of user_shifts_table) {
        if (userShift) {
          cur.users[userShift.user_id] = userShift.status;
        }
      }
      acc.set(shift.id, cur);
      return acc;
    },
    new Map<
      string,
      shiftGetPayload<{ select: Record<keyof shift, true> }> & {
        users: Record<string, boolean | null>;
      }
    >()
  );
  const vals = Array.from(result.values());
  return vals.length > 0 ? vals[0] : null;
};

export const shiftByIdAndUser = async ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) => {
  const res = await prisma.shift.findMany({
    include: {
      user_shifts_table: {
        select: {
          user_id: true,
          status: true,
        },
      },
    },
    where: {
      id,
      user_shifts_table: {
        some: {
          user_id: userId,
        },
      },
    },
  });

  const result = res.reduce(
    (acc, { user_shifts_table, ...shift }) => {
      if (shift) {
        const cur = acc.get(shift.id) ?? {
          ...shift,
          users: {} as Record<string, boolean | null>,
        };
        for (const userShift of user_shifts_table) {
          cur.users[userShift.user_id] = userShift.status;
        }

        acc.set(shift.id, cur);
      }
      return acc;
    },
    new Map<
      string,
      shiftGetPayload<{ select: Record<keyof shift, true> }> & {
        users: Record<string, boolean | null>;
      }
    >()
  );
  const vals = Array.from(result.values());
  return vals.length > 0 ? vals[0] : null;
};
