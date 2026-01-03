'use client';

import { Noop } from '@util/types';
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
  const { data: userProfile } = api.user.profile.useQuery();

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
        let isUnavailable =
          userProfile?.gender === 'male' && date.getDay() === 4;

        if (!isUnavailable) {
          const shift = calendarShiftMap.get(shiftKeyByDate(date));
          if (shift) {
            isUnavailable =
              shift.status === 'weekend' ||
              !(
                shift.status === 'free' ||
                shift.status === 'halfBusy' ||
                (shift.status === 'busy' && typeof shift.accepted === 'boolean')
              );
          } else {
            isUnavailable = false;
          }
        }

        return isUnavailable;
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
