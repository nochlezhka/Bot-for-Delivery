'use client';

import { addMonths } from 'date-fns/addMonths';
import { endOfMonth } from 'date-fns/endOfMonth';
import { forwardRef, useImperativeHandle, useMemo } from 'react';
import { pick } from 'remeda';

import { VolunteerShift } from '@/entity/shift/types';
import {
  castShiftDateTime,
  createWarningBorder,
  isAcceptAvailable,
  shiftKeyByDate,
} from '@/entity/shift/util';
import { Noop } from '@/shared/types';
import { TelegramCalendar } from '@/shared/ui/TelegramCalendar';
import { api } from '@/trpc/client';

interface VolunteerCalendarProps {
  onChangeValue: (date: VolunteerShift) => ReturnType<Noop>;
  onDateReset: Noop;
}

export interface VolunteerCalendarRef {
  resetCalendar: Noop;
  resetAndRefresh: Noop;
}

const WARNNING_BORDER = createWarningBorder().getTime();

export const VolunteerCalendar = forwardRef<
  VolunteerCalendarRef,
  VolunteerCalendarProps
>(function VoulonteerCalendar(
  { onChangeValue, onDateReset }: VolunteerCalendarProps,
  ref
) {
  const { dateRange, resetCalendar, datePicker } =
    TelegramCalendar.useDatepicker({
      onChangeValue: (date) => {
        const shift = calendarShiftMap.get(shiftKeyByDate(date));
        onChangeValue(
          shift
            ? pick(shift, ['accepted', 'id', 'status', 'dateStart'])
            : { dateStart: castShiftDateTime(date), accepted: undefined }
        );
      },
      onDateReset,
      maxDate: endOfMonth(addMonths(new Date(), 1)),
      isDateUnavailable: (date: Date) => {
        let result = false;
        const shift = calendarShiftMap.get(shiftKeyByDate(date));
        if (shift) {
          if (shift.status === 'weekend') {
            result = true;
          } else {
            result = !(
              shift.status === 'free' ||
              shift.status === 'halfBusy' ||
              (shift.status === 'busy' && typeof shift.accepted === 'boolean')
            );
          }
        }
        return result;
      },
    });

  const { data: calendarShifts, refetch } =
    api.shift.getCalendarShifts.useQuery(dateRange);
  const { calendarShiftMap, ownShiftSet, warrningShifts } = useMemo(() => {
    const { ownShiftSet, warrningShifts } = (calendarShifts ?? []).reduce(
      (res, [dateKey, shift]) => {
        if (typeof shift.accepted === 'boolean') {
          res.ownShiftSet.add(dateKey);
        }
        if (
          (isAcceptAvailable(new Date(dateKey)) && shift.accepted === false) ||
          shift.status !== 'busy'
        ) {
          res.warrningShifts.add(dateKey);
        }
        return res;
      },
      {
        ownShiftSet: new Set<number>(),
        warrningShifts: new Set<number>(),
      }
    );

    return {
      calendarShiftMap: new Map(calendarShifts),
      ownShiftSet,
      warrningShifts,
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

  return (
    <TelegramCalendar
      datepicker={datePicker}
      highlightedDays={ownShiftSet}
      isWarrning={(dateKey) =>
        dateKey < WARNNING_BORDER &&
        (warrningShifts.has(dateKey) || !calendarShiftMap.has(dateKey))
      }
    />
  );
});
