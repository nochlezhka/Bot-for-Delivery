import 'server-only';
import { createHydrationHelpers } from '@trpc/react-query/rsc';
import { headers } from 'next/headers';
import { cache } from 'react';

import { AppRouter, appRouter } from '@/server/api/root';
import { createCallerFactory, createTRPCContext } from '@/server/api/trpc';

import { createQueryClient } from './app/query-client';

const createContext = cache(async () => {
  const h = await headers();
  return createTRPCContext({ headers: new Headers(h) });
});

export const getQueryClient = cache(createQueryClient);
const caller = createCallerFactory(appRouter)(createContext);

// noinspection JSUnusedGlobalSymbols
export const { trpc, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient
);
