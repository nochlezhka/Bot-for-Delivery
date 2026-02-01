'use client';

import { action } from '@reatom/core';
import { useAction } from '@reatom/react';
import { isDate } from 'date-fns/isDate';
import { useRef } from 'react';

import { VolunteerShift } from '@/entity/shift';
import {
  VolunteerShiftControlDialog,
  volunterControllingShift,
} from '@/features/VolunteerShiftControl';
import {
  VolunteerCalendarRef,
  VolunteerShiftDateSelect,
} from '@/features/VolunteerShiftDateSelect';
import { ToastError } from '@/shared/ui/Toaster';

const setControllingShift = action((value: Date | VolunteerShift[]) => {
  if (isDate(value)) {
    volunterControllingShift.setupShift({
      accepted: undefined,
      dateStart: value,
    });
  } else if (Array.isArray(value)) {
    ToastError({ text: 'Неожиданая ошибка, сообщите координатору!' });
  } else {
    volunterControllingShift.setupShift(value);
  }
});

export const VolunteerWorkShiftCalendar = () => {
  const calendarRef = useRef<VolunteerCalendarRef>(null);
  const setControllingShiftAction = useAction(setControllingShift);

  return (
    <>
      <VolunteerShiftDateSelect
        onChangeValue={setControllingShiftAction}
        ref={calendarRef}
      />
      <VolunteerShiftControlDialog
        onClose={() => calendarRef.current?.resetCalendar()}
      />
    </>
  );
};
