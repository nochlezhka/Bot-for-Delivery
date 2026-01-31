import { pickupPointEmployeeRouter } from '@/api/pickup-point/router';
import { rpcRouter } from '@/api/rpc/router';
import shiftsRouter from '@/api/shift/router';
import { userEmployeeRouter, userRouter } from '@/api/user/router';

import { createCallerFactory, createTRPCRouter } from './trpc';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  eployee: {
    pp: pickupPointEmployeeRouter,
    user: userEmployeeRouter,
  },
  rpc: rpcRouter,
  shift: shiftsRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
