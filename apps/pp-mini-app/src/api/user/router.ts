import { user_role } from 'pickup-point-db/client';
import { z } from 'zod';

import {
  createTRPCRouter,
  employeeProcedure,
  publicProcedure,
} from '@/server/api/trpc';

import {
  createRequestSchema,
  registerRequestSchema,
  updateRequestSchema,
} from './schema';

export const userRouter = createTRPCRouter({
  profile: publicProcedure.query(async ({ ctx }) => {
    let result = null;

    if (ctx.user && ctx.user.user) {
      result =
        (await ctx.db.users.findUnique({
          where: {
            tg_id: ctx.user.user.id,
          },
        })) ?? null;
    }

    return result;
  }),
  register: publicProcedure
    .input(registerRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user?.user;
      if (user) {
        ctx.db.users.create({
          data: {
            gender: input.gender,
            name: [user.last_name, user.first_name].join(' '),
            phone: input.phone,
            tg_id: user.id,
            tg_username: user.username,
          },
        });
      }
    }),
});

export const userEmployeeRouter = createTRPCRouter({
  createUser: employeeProcedure
    .input(createRequestSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.users.create({ data: input });
    }),
  getUsers: employeeProcedure
    .input(
      z.object({
        selected: z.enum([
          user_role.employee,
          user_role.coordinator,
          user_role.guest,
          user_role.volunteer,
        ]),
      })
    )
    .query(async ({ ctx, input }) =>
      ctx.db.users.findMany({
        orderBy: { id: 'desc' },
        where: {
          role: input.selected,
        },
      })
    ),
  updateUser: employeeProcedure
    .input(updateRequestSchema)
    .mutation(async ({ ctx, input }) => {
      if (Object.keys(input).length !== 0) {
        await ctx.db.users.update({
          data: input,
          where: {
            id: input.id,
          },
        });
      }
    }),
});
