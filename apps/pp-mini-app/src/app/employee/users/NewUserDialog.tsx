'use client';
import { Dialog, useDialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { clsx } from 'clsx';
import { HTMLProps } from 'react';

import { NewUserCard } from '@/features/UserCard';
import { ToastSuccess } from '@/shared/ui/Toaster';
import { api } from '@/trpc/client';

import { UsersPageFilters } from './UsersPageFilters';

export const NewUserDialog = ({ className }: HTMLProps<HTMLDivElement>) => {
  const dialog = useDialog();

  const currentRole = UsersPageFilters.useCurrentRole();
  const utils = api.useUtils();

  const { mutate: createUser } = api.eployee.createUser.useMutation({
    onSuccess: async () => {
      await utils.eployee.getUsers.refetch({ selected: currentRole });
      ToastSuccess({ text: 'Пользователь создан!' });
      dialog.setOpen(false);
    },
  });
  return (
    <Dialog.RootProvider value={dialog} lazyMount unmountOnExit>
      <Dialog.Trigger
        className={clsx(className, 'badge badge-primary gap-1 cursor-pointer')}
      >
        Новый пользователь
      </Dialog.Trigger>
      <Dialog.Backdrop className="modal-backdrop fixed size-full" />
      <Portal>
        <Dialog.Positioner className="modal modal-open justify-center items-center">
          <Dialog.Content className="modal-box">
            <NewUserCard
              defaultValues={{ role: currentRole }}
              onSubmit={(data) => {
                console.log(data);
                createUser(data);
              }}
            />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.RootProvider>
  );
};
