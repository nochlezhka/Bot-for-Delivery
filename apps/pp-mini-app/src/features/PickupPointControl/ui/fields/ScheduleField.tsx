'use client';
import { bind, reatomField, wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';
import clsx from 'clsx';
import { ChangeEvent, HTMLProps } from 'react';
import { clone, merge } from 'remeda';
import { ALL_WEEKDAYS } from 'rrule';

import {
  defaultSchedule,
  SchedulerVal,
  scheduleToString,
  stringToSchedule,
  weekdayDict,
} from '@/api/task/util';

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
