'use client';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { CircleAlert } from 'lucide-react';
import { UserRoles } from 'pickup-point-db';
import React, { useState } from 'react';

import { RoleChips } from '@/entity/employee/ui/RoleChips';
import { RoleSelect } from '@/entity/employee/ui/RoleSelect';
import { api, RouterOutputs } from '@/trpc/client';

const DEFAULT_SELECTED = 'volunteer';

const UserCard = ({
  user,
  isLoading,
  onChange,
}: {
  user: RouterOutputs['eployee']['getUsers'][number];
  isLoading: Parameters<typeof RoleSelect>[0]['isLoading'];
  onChange: Parameters<typeof RoleSelect>[0]['onChange'];
}) => {
  return (
    <div className="card card-xs card-border shadow-sm">
      <div className="card-body">
        <h2 className="card-title">{user.name}</h2>
        <div className="flex flex-col space-y-2">
          <span>{user.gender === 'male' ? 'Мужчина' : 'Женщина'}</span>
          <span>{user.phone}</span>
          <span>{user.tgUsername ?? user.tgId.toString()}</span>
        </div>

        <div className="card-actions">
          <RoleSelect
            isLoading={isLoading}
            defaultSelected={user.role}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
};

export default function UsersPage() {
  const queryClient = useQueryClient();

  const [currentRole, setCurrentRole] = useState<UserRoles>(DEFAULT_SELECTED);
  const { data, refetch, isRefetching, isLoading } =
    api.eployee.getUsers.useQuery({
      selected: currentRole,
    });
  const {
    mutateAsync: changeRole,
    variables,
    isPending,
  } = api.eployee.changeUserRole.useMutation();

  return (
    <div className="flex flex-col relative">
      {isRefetching || isLoading ? (
        <div className="absolute w-full h-full z-50 flex justify-center items-center bg-[var(--tg-theme-bg-color,white)]/90">
          <div className="loading loading-spinner loading-lg" />
        </div>
      ) : (
        <></>
      )}
      <RoleChips defaultSelected={DEFAULT_SELECTED} onChange={setCurrentRole} />
      <div className="h-full flex flex-grow mt-2">
        {(() => {
          let result = <></>;
          if (data) {
            if (data.length === 0) {
              result = (
                <div className="inline-flex m-auto">
                  <CircleAlert />
                  <span className="ml-2">Таких пользоватлей нет</span>
                </div>
              );
            } else {
              result = (
                <div className="w-full grow flex flex-col gap-2">
                  {data.map((user) => (
                    <UserCard
                      key={user.id}
                      user={user}
                      isLoading={
                        variables && variables.id === user.id && isPending
                      }
                      onChange={async (role) => {
                        await changeRole({ id: user.id, role });
                        await Promise.all([
                          refetch(),
                          queryClient.invalidateQueries({
                            queryKey: getQueryKey(
                              api.eployee.getUsers,
                              {
                                selected: role,
                              },
                              'query'
                            ),
                          }),
                        ]);
                      }}
                    />
                  ))}
                </div>
              );
            }
          }
          return result;
        })()}
      </div>
    </div>
  );
}
