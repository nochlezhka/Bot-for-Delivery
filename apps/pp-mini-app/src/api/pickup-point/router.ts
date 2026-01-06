import { createTRPCRouter, employeeProcedure } from '@/server/api/trpc';

import { createRequestSchema, updateRequestSchema } from './schema';

export const pickupPointEmployeeRouter = createTRPCRouter({
  getList: employeeProcedure.query(async ({ ctx }) =>
    ctx.db.pickup_point.findMany({ orderBy: { id: 'desc' } })
  ),
  updateOne: employeeProcedure
    .input(updateRequestSchema)
    .mutation(async ({ ctx, input }) => {
      if (Object.keys(input).length !== 0) {
        await ctx.db.pickup_point.update({
          data: input,
          where: {
            id: input.id,
          },
        });
      }
    }),
  createOne: employeeProcedure
    .input(createRequestSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.pickup_point.create({
        data: input,
      });
    }),
});
