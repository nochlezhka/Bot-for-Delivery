'use client';
import { Dialog, useDialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { clsx } from 'clsx';
import { HousePlus } from 'lucide-react';
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
        className={clsx(
          className,
          'btn btn-primary btn-circle gap-1 cursor-pointer'
        )}
      >
        <HousePlus className="size-4" />
      </Dialog.Trigger>
      <Dialog.Backdrop className="modal-backdrop fixed size-full" />
      <Portal>
        <Dialog.Positioner className="modal modal-open justify-center items-center">
          <Dialog.Content className="modal-box pt-3">
            <NewPickupPointCard
              defaultValues={{ name: 'Пункт выдачи ночлежки' }}
              onSubmit={(data) => {
                mutate(data);
              }}
            />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.RootProvider>
  );
};
