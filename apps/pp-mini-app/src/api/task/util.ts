import { entries, merge } from 'remeda';
import { Frequency, RRule, Weekday, WeekdayStr } from 'rrule';

export type SchedulerVal = Record<WeekdayStr, boolean>;

export const weekdayDict: Record<WeekdayStr, string> = {
  FR: 'Пт',
  MO: 'Пн',
  SA: 'Вс',
  SU: 'Сб',
  TH: 'Чт',
  TU: 'Вт',
  WE: 'Ср',
};

export const dayNames = [
  'MO',
  'TU',
  'WE',
  'TH',
  'FR',
  'SA',
  'SU',
] as WeekdayStr[];

export const emptySchedule: SchedulerVal = {
  FR: false,
  MO: false,
  SA: false,
  SU: false,
  TH: false,
  TU: false,
  WE: false,
};

export const defaultSchedule: SchedulerVal = {
  FR: true,
  MO: true,
  SA: false,
  SU: false,
  TH: true,
  TU: true,
  WE: true,
};

export const scheduleToString = (v: SchedulerVal): string => {
  const rule = new RRule({
    byweekday: Array.from(entries(v)).reduce((res, [key, val]) => {
      if (val) {
        res.push(Weekday.fromStr(key));
      }
      return res;
    }, new Array<Weekday>()),
    freq: Frequency.WEEKLY,
  });
  return rule.toString();
};

export const stringToSchedule = (rruleString: string): SchedulerVal => {
  const rule = RRule.fromString(rruleString);
  const weekdays = rule.options.byweekday || [];

  return merge(
    emptySchedule,
    Object.fromEntries(weekdays.map((day) => [dayNames[day], true]))
  );
};
