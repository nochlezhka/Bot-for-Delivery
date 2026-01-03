import { TRPCError } from '@trpc/server';

import {
  castShiftDateTime,
  createShiftEndTimeByStart,
} from '@/entity/shift/util';
import { createTRPCRouter, volunteerProcedure } from '@/server/api/trpc';

import {
  getCalendarShifts,
  getOwnShiftList,
  shiftByDates,
  shiftByIdAndUser,
} from './repository';
import { shiftAction, shiftRangeRequest, shiftSignUpRequest } from './schema';

export const shiftsRouter = createTRPCRouter({
  getCalendarShifts: volunteerProcedure
    .input(shiftRangeRequest)
    .query(async ({ ctx, input: { end, start } }) =>
      getCalendarShifts({
        userId: ctx.dbUser.id,
        dateEnd: end,
        dateStart: start,
      })
    ),
  signUp: volunteerProcedure
    .input(shiftSignUpRequest)
    .use(async ({ next, input: { selectedDate }, ctx: { db, dbUser } }) => {
      const dateStart = castShiftDateTime(selectedDate);
      const dateEnd = createShiftEndTimeByStart(dateStart);

      const foundedShift = await shiftByDates({ dateStart, dateEnd });
      if (foundedShift) {
        if (typeof foundedShift.users[dbUser.id] === 'boolean') {
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
          foundedShift,
          dateStart,
          dateEnd,
        },
      });
    })
    .mutation(
      async ({ ctx: { db, dbUser, dateEnd, dateStart, foundedShift } }) => {
        await db.$transaction(async (tx) => {
          let shiftId;
          if (foundedShift) {
            shiftId = foundedShift.id;
            tx.shift.update({
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
                  title: 'Рабочая смена',
                  status: 'halfBusy',
                  date_end: dateEnd,
                  date_start: dateStart,
                },
                select: {
                  id: true,
                },
              })
            ).id;
          }
          await tx.user_shifts_table.upsert({
            create: {
              user_id: dbUser.id,
              shift_id: shiftId,
              status: false,
            },
            update: {
              status: null,
            },
            where: {
              user_id_shift_id: {
                user_id: dbUser.id,
                shift_id: shiftId,
              },
            },
          });
        });
      }
    ),

  getOwnShifts: volunteerProcedure.query(async ({ ctx }) =>
    getOwnShiftList({
      userId: ctx.dbUser.id,
    })
  ),
  accept: volunteerProcedure
    .input(shiftAction)
    .use(async ({ next, input: { id }, ctx: { db, dbUser } }) => {
      const foundedShift = await shiftByIdAndUser({
        id,
        userId: dbUser.id,
      });

      if (foundedShift) {
        if (foundedShift.users[dbUser.id] === undefined) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Вы не записаны на смену',
          });
        } else if (foundedShift.users[dbUser.id] === true) {
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
    .mutation(async ({ input: { id }, ctx: { db, dbUser } }) => {
      await db.user_shifts_table.update({
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
    .use(async ({ next, input: { id }, ctx: { db, dbUser } }) => {
      const foundedShift = await shiftByIdAndUser({
        id,
        userId: dbUser.id,
      });

      if (foundedShift) {
        if (foundedShift.users[dbUser.id] === undefined) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Вы не записаны на смену',
          });
        } else if (foundedShift.users[dbUser.id] === null) {
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
    .mutation(async ({ input: { id }, ctx: { db, dbUser, foundedShift } }) => {
      await db.$transaction(async (tx) => {
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
            status: false,
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
});
