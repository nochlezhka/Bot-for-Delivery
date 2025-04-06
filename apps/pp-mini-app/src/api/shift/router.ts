import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm/expressions';
import { schema } from 'pickup-point-db';

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
      getCalendarShifts(ctx.db, {
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

      const foundedShift = await shiftByDates(db, { dateStart, dateEnd });
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
        await db.transaction(async (tx) => {
          let shiftId;
          if (foundedShift) {
            shiftId = foundedShift.id;
            await tx
              .update(schema.shiftTable)
              .set({
                status: foundedShift.status === 'free' ? 'halfBusy' : 'busy',
              })
              .where(eq(schema.shiftTable.id, shiftId));
          } else {
            const [res] = await tx
              .insert(schema.shiftTable)
              .values([
                {
                  title: 'Рабочая смена',
                  status: 'halfBusy',
                  dateEnd,
                  dateStart,
                },
              ])
              .returning({ createdShiftId: schema.shiftTable.id });
            shiftId = res.createdShiftId;
          }
          await tx
            .insert(schema.userShiftsTable)
            .values([
              {
                userId: dbUser.id,
                shiftId,
                status: false,
              },
            ])
            .onConflictDoUpdate({
              target: [
                schema.userShiftsTable.userId,
                schema.userShiftsTable.shiftId,
              ],
              set: {
                status: false,
              },
            });
        });
      }
    ),

  getOwnShifts: volunteerProcedure.query(async ({ ctx }) =>
    getOwnShiftList(ctx.db, {
      userId: ctx.dbUser.id,
    })
  ),
  accept: volunteerProcedure
    .input(shiftAction)
    .use(async ({ next, input: { id }, ctx: { db, dbUser } }) => {
      const foundedShift = await shiftByIdAndUser(db, {
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
      await db
        .update(schema.userShiftsTable)
        .set({ status: true })
        .where(
          and(
            eq(schema.userShiftsTable.shiftId, id),
            eq(schema.userShiftsTable.userId, dbUser.id)
          )
        );
    }),
  cancel: volunteerProcedure
    .input(shiftAction)
    .use(async ({ next, input: { id }, ctx: { db, dbUser } }) => {
      const foundedShift = await shiftByIdAndUser(db, {
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
      await db.transaction(async (tx) => {
        if (foundedShift.status === 'halfBusy') {
          await tx
            .update(schema.shiftTable)
            .set({ status: 'free' })
            .where(eq(schema.shiftTable.id, id));
        } else if (foundedShift.status === 'busy') {
          await tx
            .update(schema.shiftTable)
            .set({ status: 'halfBusy' })
            .where(eq(schema.shiftTable.id, id));
        }
        await tx
          .update(schema.userShiftsTable)
          .set({ status: null })
          .where(
            and(
              eq(schema.userShiftsTable.shiftId, id),
              eq(schema.userShiftsTable.userId, dbUser.id)
            )
          );
      });
    }),
});
