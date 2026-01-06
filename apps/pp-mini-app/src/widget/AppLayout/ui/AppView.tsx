'use client';

import { PropsWithChildren } from 'react';

import { GuestRegister } from '@/features/GuestRegister';
import { api } from '@/trpc/client';

import { AuthenticatedView } from './AuthenticatedView';

export const AppView = ({ children }: PropsWithChildren) => {
  const {
    isLoading,
    data: profile,
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
        result = <AuthenticatedView>{children}</AuthenticatedView>;
      }
    } else if (profile === null) {
      result = (
        <GuestRegister className="grow" onSuccess={completeRegisterAction} />
      );
    }
  }
  return result;
};
