'use client';

import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { type PropsWithChildren } from 'react';

import { ErrorBoundary, ErrorPage, Loader } from '@/shared/ui';
import { TRPCProvider } from '@/trpc/client';

import { AppView } from './AppView';
import { useClientOnce } from '../hooks/useClientOnce';
import { useDidMount } from '../hooks/useDidMount';
import { useTelegramMock } from '../hooks/useTelegramMock';
import { init } from '../init';

function RootInner({ children }: PropsWithChildren) {
  const lp = retrieveLaunchParams();
  const isDev = process.env.NEXT_PUBLIC_MOCK_ENV === '1';
  const debug = isDev || lp.startParam === 'debug';
  useClientOnce(() => {
    init(debug);
  });
  return (
    <AppRoot
      className="w-full bg-[var(--tg-theme-bg-color,white)]"
      platform={
        ['macos', 'ios'].includes(lp.platform as string) ? 'ios' : 'base'
      }
    >
      <AppView>{children}</AppView>
    </AppRoot>
  );
}

export function AppLayout(props: PropsWithChildren) {
  // Unfortunately, Telegram Mini Apps does not allow us to use all features of
  // the Server Side Rendering. That's why we are showing loader on the server
  // side.
  const didMount = useDidMount();
  useTelegramMock();

  return didMount ? (
    <ErrorBoundary fallback={ErrorPage}>
      <TRPCProvider>
        <RootInner {...props} />
      </TRPCProvider>
    </ErrorBoundary>
  ) : (
    <div className="flex m-auto">
      <Loader />
    </div>
  );
}
