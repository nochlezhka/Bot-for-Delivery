import { addWeeks } from 'date-fns/addWeeks';
import { differenceInMilliseconds } from 'date-fns/differenceInMilliseconds';
import { endOfWeek } from 'date-fns/endOfWeek';
import { addHours } from 'date-fns/fp/addHours';
import { setHours } from 'date-fns/fp/setHours';
import { setMilliseconds } from 'date-fns/fp/setMilliseconds';
import { setMinutes } from 'date-fns/fp/setMinutes';
import { setSeconds } from 'date-fns/fp/setSeconds';
import { subMilliseconds } from 'date-fns/fp/subMilliseconds';
import { startOfDay } from 'date-fns/startOfDay';
import { pipe } from 'remeda';

import { SHIFT_ACCEPT_AVAILABLE_MS } from '@/entity/shift/constant';

export const shiftKeyByDate = (date: Date) => startOfDay(date).getTime();

const setShiftHour = setHours(12);
const setShiftMinutes = setMinutes(0);
const setShiftSeconds = setSeconds(0);
const setShiftMilliseconds = setMilliseconds(0);
export const castShiftDateTime = (date: Date): Date =>
  pipe(
    date,
    setShiftHour,
    setShiftMinutes,
    setShiftSeconds,
    setShiftMilliseconds
  );
export const createShiftEndTimeByStart = addHours(2);
export const isAcceptAvailable = (dateStart: Date) =>
  differenceInMilliseconds(dateStart, new Date()) <= SHIFT_ACCEPT_AVAILABLE_MS;

export const acceptAvailableDate = subMilliseconds(SHIFT_ACCEPT_AVAILABLE_MS);

export const createWarningBorder = () => endOfWeek(addWeeks(new Date(), 2));
