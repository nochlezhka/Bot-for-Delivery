import { endOfMonth } from 'date-fns/endOfMonth';
import { startOfDay } from 'date-fns/startOfDay';
import { startOfMonth } from 'date-fns/startOfMonth';
import { shift_status } from 'pickup-point-db/browser';

import { shiftKeyByDate } from '@/entity/shift/util';
import { prisma } from '@/server/db';

export const getCalendarShifts = async ({
  dateEnd,
  dateStart,
  userId,
}: {
  dateEnd?: Date;
  dateStart?: Date;
  userId: string;
}) => {
  const currentDate = new Date();
  const data = await prisma.shift.findMany({
    select: {
      date_start: true,
      id: true,
      status: true,
      user_shifts_table: true,
    },
    where: {
      date_end: {
        lt: dateEnd ?? endOfMonth(currentDate),
      },
      date_start: {
        gte: dateStart ?? startOfMonth(currentDate),
      },
    },
  });
  return Array.from(
    data
      .reduce(
        (acc, { date_start: dateStart, id, status, user_shifts_table }) => {
          const key = shiftKeyByDate(dateStart);
          const shift = acc.get(key) ?? {
            dateStart,
            id,
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
            accepted?: boolean | null;
            dateStart: Date;
            id: string;
            status: shift_status;
          }
        >()
      )
      .entries()
  );
};

export const getOwnShiftList = async (userId: string) => {
  const currentDate = new Date();
  const data = await prisma.shift.findMany({
    orderBy: {
      date_start: 'asc',
    },
    select: {
      date_start: true,
      id: true,
      status: true,
      user_shifts_table: true,
    },
    where: {
      date_start: {
        gte: startOfDay(currentDate),
      },
      user_shifts_table: {
        some: {
          status: { not: null },
          user_id: userId,
        },
      },
    },
  });
  return Array.from(
    data
      .reduce(
        (acc, { date_start: dateStart, id, status, user_shifts_table }) => {
          const shift = acc.get(id) ?? {
            dateStart,
            status,
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
            accepted?: boolean | null;
            dateStart: Date;
            status: shift_status;
          }
        >()
      )
      .entries()
  );
};

export const shiftByDates = async ({
  dateEnd,
  dateStart,
}: {
  dateEnd: Date;
  dateStart: Date;
}) => {
  return prisma.shift.findFirst({
    include: {
      user_shifts_table: {
        select: {
          status: true,
          user_id: true,
        },
      },
    },
    orderBy: {
      id: 'desc',
    },
    where: {
      date_end: dateEnd,
      date_start: dateStart,
    },
  });
};

export const shiftByIdAndUser = async ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) =>
  prisma.shift.findUnique({
    include: {
      user_shifts_table: {
        select: {
          status: true,
          user_id: true,
        },
        where: {
          user_id: userId,
        },
      },
    },
    where: {
      id,
    },
  });
