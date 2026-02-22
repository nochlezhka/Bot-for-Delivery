import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { clsx } from 'clsx';
import { CircleAlert } from 'lucide-react';
import { HTMLProps } from 'react';

import { ToastSuccess } from '@/shared/ui/Toaster';
import { api } from '@/trpc/client';

type UsersListingProps = HTMLProps<HTMLDivElement>;
export const TaskListing = ({ className }: UsersListingProps) => {
  const [data, { refetch }] = api.eployee.pp.getList.useSuspenseQuery();

  const queryClient = useQueryClient();
  const _ = api.eployee.pp.updateOne.useMutation({
    onSuccess: async () => {
      ToastSuccess({ text: 'Пункт выдачи обновлен!' });
      await refetch();
      await queryClient.invalidateQueries({
        queryKey: getQueryKey(api.eployee.pp.getList, undefined, 'query'),
      });
    },
  });

  let result = <></>;
  if (data) {
    if (data.length === 0) {
      result = (
        <div className="inline-flex m-auto">
          <CircleAlert />
          <span className="ml-2">Пунктов выдачи нет</span>
        </div>
      );
    } else {
      //pass
    }
  }
  return <div className={clsx(className, 'h-full flex grow')}>{result}</div>;
};
