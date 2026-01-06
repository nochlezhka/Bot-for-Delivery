'use client';
import { ChangeEvent, useContext, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { entries, merge } from 'remeda';
import { ALL_WEEKDAYS, RRule, Weekday } from 'rrule';
import { Frequency } from 'rrule/dist/esm/types';
import { WeekdayStr } from 'rrule/dist/esm/weekday';

import type { pickup_point } from 'pickup-point-db/browser';

import { PickupPointFormContext } from '../../Context';

type SchedulerVal = Record<WeekdayStr, boolean>;
const defaultSchedule: SchedulerVal = {
  MO: true,
  TU: false,
  WE: true,
  TH: false,
  FR: true,
  SA: false,
  SU: false,
};
const emptySchedule: SchedulerVal = {
  MO: false,
  TU: false,
  WE: false,
  TH: false,
  FR: false,
  SA: false,
  SU: false,
};
const weekdayDict: Record<WeekdayStr, string> = {
  FR: 'Пт',
  MO: 'Пн',
  SA: 'Вс',
  SU: 'Сб',
  TH: 'Чт',
  WE: 'Ср',
  TU: 'Вт',
};
const dayNames = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'] as WeekdayStr[];
const scheduleToString = (v: SchedulerVal) => {
  const rule = new RRule({
    freq: Frequency.WEEKLY,
    byweekday: Array.from(entries(v)).reduce((res, [key, val]) => {
      if (val) {
        res.push(Weekday.fromStr(key));
      }
      return res;
    }, new Array<Weekday>()),
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
  const { control } = useFormContext<pickup_point>();
  const { field, fieldState } = useController({
    name: 'schedule',
    control,
    defaultValue: scheduleToString(defaultSchedule),
  });
  const [weekdayActivity, setWeekdayActivity] = useState(
    field.value ? stringToSchedule(field.value) : defaultSchedule
  );

  const { trigerFieldSubmit } = useContext(PickupPointFormContext);
  const scheduledDayToggleAction = (e: ChangeEvent<HTMLInputElement>) => {
    const res = merge(weekdayActivity, {
      [e.currentTarget.value]: e.currentTarget.checked,
    } as SchedulerVal);
    setWeekdayActivity(res);
    field.onChange(scheduleToString(res));
    trigerFieldSubmit('schedule');
  };
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">Расписание</legend>
      <div className="form-control flex gap-2 flex-wrap">
        {ALL_WEEKDAYS.map((day) => (
          <label
            key={day}
            className="flex bg-slate-300 has-checked:bg-primary p-2 rounded-full cursor-pointer size-8"
          >
            <input
              checked={weekdayActivity[day] ?? false}
              type="checkbox"
              className="sr-only peer"
              name={`schedule-${day}-activity`}
              value={day}
              onChange={scheduledDayToggleAction}
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
