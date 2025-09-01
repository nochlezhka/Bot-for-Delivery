import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { clsx } from 'clsx';
import { CircleAlert } from 'lucide-react';
import { HTMLProps } from 'react';
import { merge, pick } from 'remeda';

import { UsersPageFilters } from '@/app/employee/users/UsersPageFilters';
import { ExistsUserCard } from '@/features/UserCard';
import { ToastSuccess } from '@/shared/ui/Toaster';
import { api } from '@/trpc/client';

type UsersListingProps = HTMLProps<HTMLDivElement>;
export const UsersListing = ({ className }: UsersListingProps) => {
  const currentRole = UsersPageFilters.useCurrentRole();
  const [data, { refetch }] = api.eployee.getUsers.useSuspenseQuery({
    selected: currentRole,
  });

  const queryClient = useQueryClient();
  const { mutateAsync: updateUser } = api.eployee.updateUser.useMutation({
    onSuccess: async () => {
      ToastSuccess({ text: 'Пользователь обновлен!' });
      await refetch();
      await queryClient.invalidateQueries({
        queryKey: getQueryKey(
          api.eployee.getUsers,
          {
            selected: currentRole,
          },
          'query'
        ),
      });
    },
  });

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
        <div className="w-full grow flex flex-col gap-8">
          {data.map((user) => (
            <ExistsUserCard
              autoresetOnError
              className="bg-base-100 p-2"
              key={user.id}
              defaultValues={user}
              onSubmit={(data) => updateUser(merge(data, pick(user, ['id'])))}
            >
              <></>
            </ExistsUserCard>
          ))}
        </div>
      );
    }
  }
  return (
    <div className={clsx(className, 'h-full flex flex-grow')}>{result}</div>
  );
};
