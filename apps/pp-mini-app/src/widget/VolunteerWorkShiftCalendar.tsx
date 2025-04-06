'use client';

import { Modal } from '@telegram-apps/telegram-ui';
import { useRef, useState } from 'react';

import { VolunteerShift } from '@/entity/shift';
import {
  VolunteerCalendar,
  VolunteerCalendarRef,
  VolunteerShiftControl,
} from '@/features';

export function VolunteerWorkShiftCalendar() {
  const calendarRef = useRef<VolunteerCalendarRef>(null);
  const [selectedShift, setSelectedShift] = useState<VolunteerShift | null>(
    null
  );
  return (
    <>
      <VolunteerCalendar
        ref={calendarRef}
        onChangeValue={(value) => setSelectedShift(value)}
        onDateReset={() => setSelectedShift(null)}
      />
      <Modal
        open={selectedShift !== null}
        onOpenChange={(open) => {
          if (!open) {
            calendarRef.current?.resetCalendar();
          }
        }}
        className="px-4 py-6"
      >
        {selectedShift === null ? (
          <></>
        ) : (
          <VolunteerShiftControl
            shift={selectedShift}
            onActionComplete={() => calendarRef.current?.resetAndRefresh()}
          />
        )}
      </Modal>
    </>
  );
}
