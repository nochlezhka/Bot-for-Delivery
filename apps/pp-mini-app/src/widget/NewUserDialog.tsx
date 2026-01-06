'use client';
import { Dialog, useDialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { clsx } from 'clsx';
import { UserPlus } from 'lucide-react';
import { HTMLProps } from 'react';

import { NewUserCard } from '@/features/UserControl';
import { UserRoleFilter } from '@/features/UserRoleFilter';
import { ToastSuccess } from '@/shared/ui/Toaster';
import { api } from '@/trpc/client';

export const NewUserDialog = ({ className }: HTMLProps<HTMLDivElement>) => {
  const dialog = useDialog();

  const currentRole = UserRoleFilter.useCurrentRole();
  const utils = api.useUtils();

  const { mutate: createUser } = api.eployee.user.createUser.useMutation({
    onSuccess: async () => {
      await utils.eployee.user.getUsers.refetch({ selected: currentRole });
      ToastSuccess({ text: 'Пользователь создан!' });
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
        <UserPlus className="size-4" />
      </Dialog.Trigger>
      <Dialog.Backdrop className="modal-backdrop fixed size-full" />
      <Portal>
        <Dialog.Positioner className="modal modal-open justify-center items-center">
          <Dialog.Content className="modal-box  pt-3">
            <NewUserCard
              defaultValues={{ role: currentRole }}
              onSubmit={(data) => {
                createUser(data);
              }}
            />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.RootProvider>
  );
};
