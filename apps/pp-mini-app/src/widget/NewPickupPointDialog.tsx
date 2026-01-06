'use client';
import { Dialog, useDialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { clsx } from 'clsx';
import { HTMLProps } from 'react';

import { NewPickupPointCard } from '@/features/PickupPointControl';
import { ToastSuccess } from '@/shared/ui/Toaster';
import { api } from '@/trpc/client';

export const NewPickupPointDialog = ({
  className,
}: HTMLProps<HTMLDivElement>) => {
  const dialog = useDialog();

  const { mutate } = api.eployee.pp.createOne.useMutation({
    onSuccess: async () => {
      ToastSuccess({ text: 'Пункт выдачи создан!' });
      dialog.setOpen(false);
    },
  });
  return (
    <Dialog.RootProvider value={dialog} lazyMount unmountOnExit>
      <Dialog.Trigger
        className={clsx(className, 'badge badge-primary gap-1 cursor-pointer')}
      >
        Добавить пункт выдачи
      </Dialog.Trigger>
      <Dialog.Backdrop className="modal-backdrop fixed size-full" />
      <Portal>
        <Dialog.Positioner className="modal modal-open justify-center items-center">
          <Dialog.Content className="modal-box">
            <NewPickupPointCard
              defaultValues={{ name: '' }}
              onSubmit={(data) => {
                console.log(data);
                mutate(data);
              }}
            />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.RootProvider>
  );
};
