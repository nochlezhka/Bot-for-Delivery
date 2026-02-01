'use client';

import { Dialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { computed, wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';
import { Noop } from '@util/types';

import { volunterControllingShift } from '../state';
import { VolunteerShiftControl } from './VolunteerShiftControl';

interface VolunteerShiftControlDialogProps {
  onClose?: Noop;
}

const isDialogOpened = computed(() => volunterControllingShift() !== null);

export const VolunteerShiftControlDialog =
  reatomComponent<VolunteerShiftControlDialogProps>(({ onClose }) => {
    return (
      <Dialog.Root
        lazyMount
        modal
        onOpenChange={wrap(async ({ open }) => {
          if (!open) {
            volunterControllingShift.clearShift();
            await onClose?.();
          }
        })}
        open={isDialogOpened()}
        unmountOnExit
      >
        <Portal>
          <Dialog.Positioner className="absolute z-10 flex justify-center items-center">
            <Dialog.Content className="flex bg-base-100 text-primary-content p-5 rounded-lg">
              <VolunteerShiftControl
                onActionComplete={wrap(volunterControllingShift.clearShift)}
                shift={volunterControllingShift()}
              />
            </Dialog.Content>
          </Dialog.Positioner>
          <Dialog.Backdrop className="fixed size-full bg-black/50" />
        </Portal>
      </Dialog.Root>
    );
  }, 'VolunteerShiftControlDialog');
