import 'server-only';
import { createHydrationHelpers } from '@trpc/react-query/rsc';
import { headers } from 'next/headers';
import { cache } from 'react';

import { appRouter } from '@/server/api/root';
import { createCallerFactory, createTRPCContext } from '@/server/api/trpc';

import { createQueryClient } from './app/query-client';

const createContext = cache(async () => {
  return createTRPCContext({ headers: new Headers(headers()) });
});

export const getQueryClient = cache(createQueryClient);
const caller = createCallerFactory(appRouter)(createContext);

export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getQueryClient
);
