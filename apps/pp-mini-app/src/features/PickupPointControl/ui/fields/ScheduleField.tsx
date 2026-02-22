'use client';
import { bind, reatomField, wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';
import clsx from 'clsx';
import { ChangeEvent, HTMLProps } from 'react';
import { clone, entries, merge } from 'remeda';
import { ALL_WEEKDAYS, RRule, Weekday } from 'rrule';
import { Frequency } from 'rrule/dist/esm/types';
import { WeekdayStr } from 'rrule/dist/esm/weekday';

type SchedulerVal = Record<WeekdayStr, boolean>;
const defaultSchedule: SchedulerVal = {
  FR: true,
  MO: true,
  SA: false,
  SU: false,
  TH: true,
  TU: true,
  WE: true,
};
const emptySchedule: SchedulerVal = {
  FR: false,
  MO: false,
  SA: false,
  SU: false,
  TH: false,
  TU: false,
  WE: false,
};
const weekdayDict: Record<WeekdayStr, string> = {
  FR: 'Пт',
  MO: 'Пн',
  SA: 'Вс',
  SU: 'Сб',
  TH: 'Чт',
  TU: 'Вт',
  WE: 'Ср',
};
const dayNames = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'] as WeekdayStr[];
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

export const createDefaultSchedule = () => scheduleToString(defaultSchedule);

export const createScheduleFiled = (schedule?: string) =>
  reatomField<SchedulerVal, string>(
    schedule ? stringToSchedule(schedule) : clone(defaultSchedule),
    {
      fromState: scheduleToString,
      toState: stringToSchedule,
    }
  );

type FieldAtom = ReturnType<typeof createScheduleFiled>;

interface ScheduleFieldProps extends HTMLProps<HTMLDivElement> {
  schedule: FieldAtom;
}

export const ScheduleField = reatomComponent(
  ({ className, schedule }: ScheduleFieldProps) => {
    return (
      <fieldset className={clsx('fieldset', className)}>
        <legend className="fieldset-legend sr-only">Неделя расписания</legend>
        <div className="form-control flex gap-2 flex-wrap">
          {ALL_WEEKDAYS.map((day) => (
            <label
              className="flex bg-slate-300 has-checked:bg-primary p-2 rounded-full cursor-pointer size-8 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent-content"
              key={day}
            >
              <input
                checked={schedule()[day] ?? false}
                className="sr-only peer"
                name={`schedule-${day}-activity`}
                onChange={bind((e: ChangeEvent<HTMLInputElement>) => {
                  const res = merge(schedule(), {
                    [e.currentTarget.value]: e.currentTarget.checked,
                  } as SchedulerVal);
                  return wrap(schedule.set(res));
                })}
                type="checkbox"
                value={day}
              />
              <span className="text-white peer-checked:text-primary-content! whitespace-nowrap break-keep">
                {weekdayDict[day]}
              </span>
            </label>
          ))}
        </div>
        {schedule.validation().triggered && schedule.validation().error ? (
          <div className="text-error">{schedule.validation().error}</div>
        ) : (
          <></>
        )}
      </fieldset>
    );
  }
);
