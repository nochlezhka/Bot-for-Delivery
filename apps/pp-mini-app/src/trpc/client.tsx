'use client';
import type {
  QueryClient,
  QueryClientProviderProps,
} from '@tanstack/react-query';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

import { QueryClientProvider } from '@tanstack/react-query';
import { retrieveRawInitData } from '@telegram-apps/sdk';
import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { queryClientAtom } from 'jotai-tanstack-query';
import { Provider } from 'jotai/react';
import { useHydrateAtoms } from 'jotai/utils';
import { PropsWithChildren, useState } from 'react';
import superjson from 'superjson';

import { type AppRouter } from '@/server/api/root';

import { createQueryClient } from './app/query-client';

let clientQueryClientSingleton: QueryClient | undefined = undefined;

const getBaseUrl = () => {
  let result = `http://localhost:${process.env.PORT ?? 3000}`;
  if (typeof window !== 'undefined') {
    result = window.location.origin;
  }
  if (process.env.VERCEL_URL) {
    result = `https://${process.env.VERCEL_URL}`;
  }
  return result;
};

const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return createQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= createQueryClient());
};

export const api = createTRPCReact<AppRouter>();

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
const HydrateAtoms = ({
  children,
  client,
}: PropsWithChildren & QueryClientProviderProps) => {
  useHydrateAtoms([[queryClientAtom, client]]);
  return children;
};

export function TRPCProvider({ children }: Readonly<PropsWithChildren>) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === 'development' ||
            (op.direction === 'down' && op.result instanceof Error),
        }),
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
    })
  );

  return (
    <Provider>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <HydrateAtoms client={queryClient}>{children}</HydrateAtoms>
        </QueryClientProvider>
      </api.Provider>
    </Provider>
  );
}
