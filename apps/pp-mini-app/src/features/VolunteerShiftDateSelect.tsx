'use client';

import { Noop } from '@util/types';
import { addMonths } from 'date-fns/addMonths';
import { endOfMonth } from 'date-fns/endOfMonth';
import { FC, HTMLProps, useImperativeHandle, useMemo } from 'react';
import { merge } from 'remeda';

import { VolunteerShift } from '@/entity/shift/types';
import { shiftKeyByDate } from '@/entity/shift/util';
import { TelegramCalendar } from '@/shared/ui/TelegramCalendar';
import { api } from '@/trpc/client';

export interface VolunteerCalendarRef {
  resetAndRefresh: Noop;
  resetCalendar: Noop;
}

interface VolunteerCalendarProps extends HTMLProps<VolunteerCalendarRef> {
  onChangeValue: (date: Date | VolunteerShift[]) => ReturnType<Noop>;
  onDateReset: Noop;
}

export const VolunteerShiftDateSelect: FC<VolunteerCalendarProps> = ({
  onChangeValue,
  onDateReset,
  ref,
}) => {
  const { datePicker, dateRange, resetCalendar } =
    TelegramCalendar.useDatepicker({
      isDateUnavailable: (date: Date) => {
        return !calendarShiftMap.has(shiftKeyByDate(date));
      },
      maxDate: endOfMonth(addMonths(new Date(), 1)),
      onChangeValue: (date) => {
        const shifts = calendarShiftMap.get(shiftKeyByDate(date));
        onChangeValue(shifts ?? date);
      },
      onDateReset,
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
      resetAndRefresh: async () => {
        await refetch();
        resetCalendar();
      },
      resetCalendar,
    }),
    [refetch, resetCalendar]
  );

  return <TelegramCalendar datepicker={datePicker} daycolors={undefined} />;
};
