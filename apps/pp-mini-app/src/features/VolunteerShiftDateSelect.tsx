'use client';

import { Noop } from '@util/types';
import { addMonths } from 'date-fns/addMonths';
import { endOfMonth } from 'date-fns/endOfMonth';
import { forwardRef, useImperativeHandle, useMemo } from 'react';
import { merge } from 'remeda';

import { VolunteerShift } from '@/entity/shift/types';
import { shiftKeyByDate } from '@/entity/shift/util';
import { TelegramCalendar } from '@/shared/ui/TelegramCalendar';
import { api } from '@/trpc/client';

interface VolunteerCalendarProps {
  onChangeValue: (date: VolunteerShift[] | Date) => ReturnType<Noop>;
  onDateReset: Noop;
}

export interface VolunteerCalendarRef {
  resetCalendar: Noop;
  resetAndRefresh: Noop;
}

export const VolunteerShiftDateSelect = forwardRef<
  VolunteerCalendarRef,
  VolunteerCalendarProps
>(function VoulonteerCalendar(
  { onChangeValue, onDateReset }: VolunteerCalendarProps,
  ref
) {
  const { dateRange, resetCalendar, datePicker } =
    TelegramCalendar.useDatepicker({
      onChangeValue: (date) => {
        const shifts = calendarShiftMap.get(shiftKeyByDate(date));
        onChangeValue(shifts ?? date);
      },
      onDateReset,
      maxDate: endOfMonth(addMonths(new Date(), 1)),
      isDateUnavailable: (date: Date) => {
        return !calendarShiftMap.has(shiftKeyByDate(date));
      },
    });

  const { data: calendarShifts, refetch } = api.shift.getTaskShifts.useQuery(
    merge(dateRange, { taskId: '' })
  );
  const { calendarShiftMap } = useMemo(() => {
    return {
      calendarShiftMap: new Map(calendarShifts),
      ownShiftSet: new Set<number>(),
      warrningShifts: new Set<number>(),
    };
  }, [calendarShifts]);

  useImperativeHandle(
    ref,
    () => ({
      resetCalendar,
      resetAndRefresh: async () => {
        await refetch();
        resetCalendar();
      },
    }),
    [refetch, resetCalendar]
  );

  return <TelegramCalendar datepicker={datePicker} daycolors={undefined} />;
});
