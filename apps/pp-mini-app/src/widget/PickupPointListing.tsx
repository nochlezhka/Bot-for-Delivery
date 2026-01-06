import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { clsx } from 'clsx';
import { CircleAlert } from 'lucide-react';
import { HTMLProps } from 'react';
import { merge, pick } from 'remeda';

import { UpdatePickupPointCard } from '@/features/PickupPointControl';
import { ToastSuccess } from '@/shared/ui/Toaster';
import { api } from '@/trpc/client';

type UsersListingProps = HTMLProps<HTMLDivElement>;
export const PickupPointListing = ({ className }: UsersListingProps) => {
  const [data, { refetch }] = api.eployee.pp.getList.useSuspenseQuery();

  const queryClient = useQueryClient();
  const { mutateAsync: updatePickuppoint } =
    api.eployee.pp.updateOne.useMutation({
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
      result = (
        <div className="w-full grow flex flex-col gap-8">
          {data.map((pickuppoint) => (
            <UpdatePickupPointCard
              autoresetOnError
              className="bg-base-100 p-2"
              key={pickuppoint.id}
              defaultValues={pickuppoint}
              onSubmit={(data) =>
                updatePickuppoint(merge(data, pick(pickuppoint, ['id'])))
              }
            >
              <></>
            </UpdatePickupPointCard>
          ))}
        </div>
      );
    }
  }
  return (
    <div className={clsx(className, 'h-full flex flex-grow')}>{result}</div>
  );
};
