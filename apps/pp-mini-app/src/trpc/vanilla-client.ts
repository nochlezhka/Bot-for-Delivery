'use client';

import { retrieveRawInitData } from '@telegram-apps/sdk';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

import { type AppRouter } from '@/server/api/root';

const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    return `http://localhost:${process.env.PORT ?? 3000}`;
  }
  return window.location.origin;
};

export const trpcVanilla = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      headers: () => {
        const headers = new Headers();
        headers.set('authorization', `tma ${retrieveRawInitData()}`);
        return headers;
      },
      transformer: superjson,
      url: getBaseUrl() + '/api/trpc',
    }),
  ],
});
