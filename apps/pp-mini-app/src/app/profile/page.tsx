'use client';
import { useMemo } from 'react';

import { api } from '@/trpc/client';

export default function ProfilePage() {
  const { data } = api.user.profile.useQuery();
  const username = useMemo(
    () =>
      data
        ? data.tg_username
          ? data.tg_username
          : '@id' + data.tg_id?.toString()
        : null,
    [data]
  );
  return (
    <div className="min-h-full w-full flex flex-col space-y-2 px-1 relative">
      {data ? (
        <div className="flex items-start">
          <div className="avatar avatar-placeholder">
            <div className="w-32 rounded-full avatar-placeholder bg-neutral text-neutral-content ">
              <span className="text-xl">{data.name.slice(0, 3)}</span>
            </div>
          </div>
          <div className="ml-2 flex flex-col space-y-2">
            <p className="text-xl font-bold">{data.name}</p>
            <p className="text-secondary-content lowercase flex flex-wrap gap-2">
              <span>
                {(() => {
                  let result = 'Неизвестная роль';
                  switch (data.role) {
                    case 'guest':
                      result = 'Гость';
                      break;
                    case 'volunteer':
                      result = 'Волонтер';
                      break;
                    case 'coordinator':
                      result = 'Координатор';
                      break;
                    case 'employee':
                      result = 'Сотрудник';
                      break;
                  }

                  return result;
                })()}
              </span>
              <span>{data.gender === 'male' ? 'Мужчина' : 'Женщина'}</span>
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
          <div className="loading loading-spinner loading-lg" />
        </div>
      )}
    </div>
  );
}
