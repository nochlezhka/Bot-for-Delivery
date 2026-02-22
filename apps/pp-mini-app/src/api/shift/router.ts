import { TRPCError } from '@trpc/server';
import { addWeeks } from 'date-fns/addWeeks';
import { endOfMonth } from 'date-fns/endOfMonth';
import { merge, pick } from 'remeda';
import { RRule, rrulestr } from 'rrule';

import { ExistShift, FreeShift, OwnShift } from '@/api/shift/type';
import {
  castShiftDateTime,
  createShiftEndTimeByStart,
} from '@/entity/shift/util';
import { createTRPCRouter, volunteerProcedure } from '@/server/api/trpc';
import { prisma } from '@/server/db';

import { getOwnShiftList, shiftByDates, shiftByIdAndUser } from './repository';
import { shiftAction, shiftRangeRequest, shiftSignUpRequest } from './schema';

const shiftsRouter = createTRPCRouter({
  accept: volunteerProcedure
    .input(shiftAction)
    .use(async ({ ctx: { dbUser }, input: { id }, next }) => {
      const foundedShift = await shiftByIdAndUser({
        id,
        userId: dbUser.id,
      });

      if (foundedShift) {
        const userShift = foundedShift.user_shifts_table.find(
          (x) => x.user_id === dbUser.id
        );

        if (userShift === undefined) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Вы не записаны на смену',
          });
        } else if (userShift.status === true) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Вы уже подтвердили смену',
          });
        }
      } else {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Смена не найдена',
        });
      }
      return next();
    })
    .mutation(async ({ ctx: { dbUser }, input: { id } }) => {
      await prisma.user_shifts_table.update({
        data: {
          status: true,
        },
        where: {
          user_id_shift_id: {
            shift_id: id,
            user_id: dbUser.id,
          },
        },
      });
    }),
  cancel: volunteerProcedure
    .input(shiftAction)
    .use(async ({ ctx: { dbUser }, input: { id }, next }) => {
      const foundedShift = await shiftByIdAndUser({
        id,
        userId: dbUser.id,
      });

      if (foundedShift) {
        const userShift = foundedShift.user_shifts_table.find(
          (x) => x.user_id === dbUser.id
        );
        if (userShift === undefined) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Вы не записаны на смену',
          });
        } else if (userShift.status === null) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Вы уже отменили смену',
          });
        }
      } else {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Смена не найдена',
        });
      }
      return next({ ctx: { foundedShift } });
    })
    .mutation(async ({ ctx: { dbUser, foundedShift }, input: { id } }) => {
      await prisma.$transaction(async (tx) => {
        if (foundedShift.status === 'halfBusy') {
          await tx.shift.update({
            data: {
              status: 'free',
            },
            where: {
              id,
            },
          });
        } else if (foundedShift.status === 'busy') {
          await tx.shift.update({
            data: {
              status: 'halfBusy',
            },
            where: {
              id,
            },
          });
        }
        await tx.user_shifts_table.update({
          data: {
            status: null,
          },
          where: {
            user_id_shift_id: {
              shift_id: id,
              user_id: dbUser.id,
            },
          },
        });
      });
    }),

  getOwnShifts: volunteerProcedure.query(async ({ ctx }) =>
    getOwnShiftList(ctx.dbUser.id)
  ),
  getTaskShifts: volunteerProcedure
    .input(shiftRangeRequest)
    .query(async ({ ctx, input: { end, start, taskId } }) => {
      const task = await prisma.task_schedule.findMany({
        where: {
          task_id: taskId,
        },
      });

      /*let schedule: null | RRule = null;
      if (task.is_active) {
        if (task.gender === null || task.gender === ctx.dbUser.gender) {
          schedule = rrulestr(task.schedule);
        }
      }

      const after = start ?? new Date();
      const before = end ?? endOfMonth(addWeeks(after, 2));
      const plannedShifts = new Set<number>();
      for (const scheduledShift of schedule?.between(after, before) ?? []) {
        plannedShifts.add(scheduledShift.getTime());
      }

      const shifts = await prisma.shift.findMany({
        include: {
          user_shifts_table: true,
        },
        where: {
          date_start: {
            gte: before,
            lte: after,
          },
        },
      });

      const result = new Map<
        number,
        Array<ExistShift | FreeShift | OwnShift>
      >();

      for (const existShift of shifts) {
        const shiftTimestamp = existShift.date_start.getTime();
        if (plannedShifts.has(shiftTimestamp)) {
          plannedShifts.delete(shiftTimestamp);
        }

        let shift: ExistShift | OwnShift;
        const userStatusMap = existShift.user_shifts_table.reduce(
          (res, cur) => {
            res.set(cur.user_id, cur.status);
            return res;
          },
          new Map<string, boolean | null>()
        );
        const userStatus = userStatusMap.get(ctx.dbUser.id);
        if (userStatus === undefined) {
          shift = merge(pick(existShift, ['id', 'status']), {
            dateStart: existShift.date_start,
          }) satisfies ExistShift;
        } else {
          shift = merge(pick(existShift, ['id', 'status']), {
            accepted: userStatus,
            dateStart: existShift.date_start,
          }) satisfies OwnShift;
        }

        result.set(
          shiftTimestamp,
          (result.get(shiftTimestamp) ?? []).concat(shift)
        );
      }

      for (const plannedShitTimestamp of plannedShifts) {
        result.set(
          plannedShitTimestamp,
          (result.get(plannedShitTimestamp) ?? []).concat({
            dateStart: new Date(plannedShitTimestamp),
            status: 'free',
          } satisfies FreeShift)
        );
      }*/
      const result = new Map<any, any>();
      return Array.from(result.entries());
    }),
  signUp: volunteerProcedure
    .input(shiftSignUpRequest)
    .use(async ({ ctx: { dbUser }, input: { selectedDate }, next }) => {
      const dateStart = castShiftDateTime(selectedDate);
      const dateEnd = createShiftEndTimeByStart(dateStart);

      const foundedShift = await shiftByDates({ dateEnd, dateStart });
      if (foundedShift) {
        if (
          typeof foundedShift.user_shifts_table.find(
            (x) => x.user_id === dbUser.id
          )?.status === 'boolean'
        ) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Вы уже записаны на смену',
          });
        } else if (foundedShift.status === 'busy') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Смена уже занята',
          });
        } else if (foundedShift.status === 'weekend') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Нельзя записаться на выходной день',
          });
        }
      }
      return next({
        ctx: {
          dateEnd,
          dateStart,
          foundedShift,
        },
      });
    })
    .mutation(async ({ ctx: { dateEnd, dateStart, dbUser, foundedShift } }) => {
      await prisma.$transaction(async (tx) => {
        let shiftId;
        if (foundedShift) {
          shiftId = foundedShift.id;
          await tx.shift.update({
            data: {
              status: foundedShift.status === 'free' ? 'halfBusy' : 'busy',
            },
            where: {
              id: shiftId,
            },
          });
        } else {
          shiftId = (
            await tx.shift.create({
              data: {
                date_end: dateEnd,
                date_start: dateStart,
                status: 'halfBusy',
                title: 'Рабочая смена',
              },
              select: {
                id: true,
              },
            })
          ).id;
        }
        await tx.user_shifts_table.upsert({
          create: {
            shift_id: shiftId,
            status: false,
            user_id: dbUser.id,
          },
          update: {
            status: false,
          },
          where: {
            user_id_shift_id: {
              shift_id: shiftId,
              user_id: dbUser.id,
            },
          },
        });
      });
    }),
});
export default shiftsRouter;
