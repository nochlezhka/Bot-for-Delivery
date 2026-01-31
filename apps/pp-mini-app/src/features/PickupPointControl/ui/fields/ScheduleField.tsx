'use client';
import type { project_task } from 'pickup-point-db/browser';

import { ChangeEvent, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { entries, merge } from 'remeda';
import { ALL_WEEKDAYS, RRule, Weekday } from 'rrule';
import { Frequency } from 'rrule/dist/esm/types';
import { WeekdayStr } from 'rrule/dist/esm/weekday';

type SchedulerVal = Record<WeekdayStr, boolean>;
const defaultSchedule: SchedulerVal = {
  FR: true,
  MO: true,
  SA: false,
  SU: false,
  TH: false,
  TU: false,
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
const scheduleToString = (v: SchedulerVal) => {
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
const stringToSchedule = (rruleString: string) => {
  const rule = RRule.fromString(rruleString);
  const weekdays = rule.options.byweekday || [];

  return merge(
    emptySchedule,
    Object.fromEntries(weekdays.map((day) => [dayNames[day], true]))
  );
};

export const ScheduleField = () => {
  const { control } = useFormContext<project_task>();
  const { field, fieldState } = useController({
    control,
    defaultValue: scheduleToString(defaultSchedule),
    name: 'schedule',
  });
  const [weekdayActivity, setWeekdayActivity] = useState(
    field.value ? stringToSchedule(field.value) : defaultSchedule
  );

  const scheduledDayToggleAction = (e: ChangeEvent<HTMLInputElement>) => {
    const res = merge(weekdayActivity, {
      [e.currentTarget.value]: e.currentTarget.checked,
    } as SchedulerVal);
    setWeekdayActivity(res);
    field.onChange(scheduleToString(res));
  };
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">Расписание</legend>
      <div className="form-control flex gap-2 flex-wrap">
        {ALL_WEEKDAYS.map((day) => (
          <label
            className="flex bg-slate-300 has-checked:bg-primary p-2 rounded-full cursor-pointer size-8"
            key={day}
          >
            <input
              checked={weekdayActivity[day] ?? false}
              className="sr-only peer"
              name={`schedule-${day}-activity`}
              onChange={scheduledDayToggleAction}
              type="checkbox"
              value={day}
            />
            <span className="text-white peer-checked:text-primary-content!">
              {weekdayDict[day]}
            </span>
          </label>
        ))}
      </div>
      {fieldState.error?.message ? (
        <div className="text-error">{fieldState.error.message}</div>
      ) : (
        <></>
      )}
    </fieldset>
  );
};
