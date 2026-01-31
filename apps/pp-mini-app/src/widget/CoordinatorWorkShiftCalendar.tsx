/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Dialog, Portal } from '@ark-ui/react';
import { isDate } from 'date-fns/isDate';
import { useRef, useState } from 'react';

import { VolunteerShift } from '@/entity/shift/types';
import { VolunteerShiftControl } from '@/features/VolunteerShiftControl';
import {
  VolunteerCalendarRef,
  VolunteerShiftDateSelect,
} from '@/features/VolunteerShiftDateSelect';

export function CoordinatorWorkShiftCalendar() {
  const calendarRef = useRef<VolunteerCalendarRef>(null);
  const [selectedShift, setSelectedShift] = useState<null | VolunteerShift>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedShifts, setSelectedShifts] = useState<null | VolunteerShift[]>(
    null
  );

  return (
    <>
      <VolunteerShiftDateSelect
        onChangeValue={(value) => {
          if (isDate(value)) {
            setSelectedDate(value);
          } else if (Array.isArray(value)) {
            setSelectedShifts(value);
          } else {
            setSelectedShift(value);
          }
        }}
        onDateReset={() => {
          //pass
        }}
        ref={calendarRef}
      />
      <Dialog.Root
        lazyMount
        modal
        onOpenChange={({ open }) => {
          if (!open) {
            setSelectedShift(null);
            calendarRef.current?.resetCalendar();
          }
        }}
        open={selectedShift !== null}
        skipAnimationOnMount
        unmountOnExit
      >
        <Portal>
          <Dialog.Positioner className="absolute z-10 flex justify-center items-center">
            <Dialog.Content className="flex bg-base-100 p-5 rounded-lg">
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
