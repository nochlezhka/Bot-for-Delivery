'use client';

import { PropsWithChildren } from 'react';

import { CurrentPageSelect } from '@/features/CurrentPageSelect';
import { GuestRegister } from '@/features/GuestRegister';
import { api } from '@/trpc/client';

export const AppView = ({ children }: PropsWithChildren) => {
  const {
    data: profile,
    isLoading,
    refetch: refreshProfile,
  } = api.user.profile.useQuery();

  const completeRegisterAction = async () => {
    await refreshProfile();
  };
  let result = (
    <div className="flex justify-center">
      <div className="loading loading-spinner loading-lg" />
    </div>
  );
  if (!isLoading) {
    if (profile) {
      if (profile.role === 'guest') {
        result = (
          <div className="h-full w-full flex items-center justify-center text-center">
            Ожидайте зачисления в волонтеры
          </div>
        );
      } else {
        result = (
          <div className="grid! grid-rows-1fr w-screen gap-2 overflow-hidden h-dvh pt-2 pb-5">
            {children}
            <CurrentPageSelect />
          </div>
        );
      }
    } else if (profile === null) {
      result = (
        <GuestRegister className="grow" onSuccess={completeRegisterAction} />
      );
    }
  }
  return result;
};
