import { shiftsRouter } from '@/api/shift/router';
import { eployeeRouter, userRouter } from '@/api/user/router';
import { rpcRouter } from '@/api/rpc/router';

import { createCallerFactory, createTRPCRouter } from './trpc';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  eployee: eployeeRouter,
  shift: shiftsRouter,
  rpc: rpcRouter,
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
