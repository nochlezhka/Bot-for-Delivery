'use client';

import { Dialog, Portal } from '@ark-ui/react';
import { useRef, useState } from 'react';

import { VolunteerShift } from '@/entity/shift/types';
import { VolunteerShiftControl } from '@/features/VolunteerShiftControl';
import {
  VolunteerCalendarRef,
  VolunteerShiftDateSelect,
} from '@/features/VolunteerShiftDateSelect';

export function VolunteerWorkShiftCalendar() {
  const calendarRef = useRef<VolunteerCalendarRef>(null);
  const [selectedShift, setSelectedShift] = useState<null | VolunteerShift>(
    null
  );
  return (
    <>
      <VolunteerShiftDateSelect
        onChangeValue={(value) => setSelectedShift(value)}
        onDateReset={() => setSelectedShift(null)}
        ref={calendarRef}
      />
      <Dialog.Root
        lazyMount
        modal
        onOpenChange={({ open }) => {
          if (!open) {
            calendarRef.current?.resetCalendar();
          }
        }}
        open={selectedShift !== null}
        unmountOnExit
      >
        <Portal>
          <Dialog.Positioner className="absolute z-10 flex justify-center items-center">
            <Dialog.Content className="flex bg-base-100 text-primary-content p-5 rounded-lg">
              {selectedShift === null ? (
                <></>
              ) : (
                <VolunteerShiftControl
                  onActionComplete={() =>
                    calendarRef.current?.resetAndRefresh()
                  }
                  shift={selectedShift}
                />
              )}
            </Dialog.Content>
          </Dialog.Positioner>
          <Dialog.Backdrop className="fixed size-full bg-black/50" />
        </Portal>
      </Dialog.Root>
    </>
  );
}
