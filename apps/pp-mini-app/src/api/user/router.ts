import { eq } from 'drizzle-orm/expressions';
import { schema } from 'pickup-point-db';
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
        (await ctx.db.query.userTable.findFirst({
          where: eq(schema.userTable.tgId, BigInt(ctx.user.user.id)),
        })) ?? null;
    }

    return result;
  }),
  register: publicProcedure
    .input(registerRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user?.user;
      if (user) {
        await ctx.db.insert(schema.userTable).values({
          tgUsername: user.username,
          gender: input.gender,
          name: [user.last_name, user.first_name].join(' '),
          phone: input.phone,
          tgId: BigInt(user.id),
        });
      }
    }),
});

export const employeeRouter = createTRPCRouter({
  getUsers: employeeProcedure
    .input(
      z.object({
        selected: z.enum(schema.userRoleEnum.enumValues),
      })
    )
    .query(async ({ ctx, input }) =>
      ctx.db.query.userTable.findMany({
        where: ({ role }, { eq }) => eq(role, input.selected),
      })
    ),
  updateUser: employeeProcedure
    .input(updateRequestSchema)
    .mutation(async ({ ctx, input }) => {
      if (Object.keys(input).length !== 0) {
        await ctx.db
          .update(schema.userTable)
          .set(input)
          .where(eq(schema.userTable.id, input.id));
      }
    }),
  createUser: employeeProcedure
    .input(createRequestSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(schema.userTable).values(input);
    }),
});
