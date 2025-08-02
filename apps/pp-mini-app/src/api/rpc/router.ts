import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
// noinspection ES6UnusedImports
import { rpcPing } from '@/server/rmq';
// const rpcPing = () => Promise.resolve('[]');
export const rpcRouter = createTRPCRouter({
  ping: publicProcedure.query(async () => {
    const res = await rpcPing();
    return { res };
  }),
});
