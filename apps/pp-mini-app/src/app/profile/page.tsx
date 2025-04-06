'use client';
import { Avatar, Spinner } from '@telegram-apps/telegram-ui';
import React, { useMemo } from 'react';

import { api } from '@/trpc/client';

export default function ProfilePage() {
  const { data } = api.user.profile.useQuery();
  const username = useMemo(
    () =>
      data
        ? data.tgUsername
          ? data.tgUsername
          : '@id' + data.tgId.toString()
        : null,
    [data]
  );
  return (
    <div className="min-h-full w-full flex flex-col space-y-2 pt-1 px-1 relative">
      {data ? (
        <div className="flex items-start">
          <Avatar size={96} />
          <div className="ml-2 flex flex-col space-y-2">
            <p className="text-xl font-bold">{data.name}</p>
            <p className="text-[var(--tg-theme-subtitle-text-color)]">
              {data.gender === 'male' ? 'Мужчина' : 'Женщина'}
            </p>
            <p className="">{data.phone}</p>
            <a
              className="text-[var(--tg-theme-link-color)]"
              href={`https://t.me/${username}`}
            >
              {username}
            </a>
          </div>
        </div>
      ) : (
        <div className="absolute w-full h-full z-50 flex justify-center items-center bg-[var(--tg-theme-bg-color,white)]/90">
          <Spinner size="l" />
        </div>
      )}
    </div>
  );
}
