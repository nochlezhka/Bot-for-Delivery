import clsx from 'clsx';
import { ALL_WEEKDAYS } from 'rrule';

import { stringToSchedule, weekdayDict } from '@/api/task/util';

interface ScheduleViewProps {
  className?: string;
  schedule: string;
}

export const ScheduleView = ({ className, schedule }: ScheduleViewProps) => {
  const scheduleMap = stringToSchedule(schedule);

  return (
    <div className={clsx('flex gap-2 flex-wrap', className)}>
      {ALL_WEEKDAYS.map((day) => {
        const isActive = scheduleMap[day] ?? false;
        return (
          <div
            className={clsx(
              'flex items-center justify-center p-2 rounded-full size-8 text-sm font-medium',
              isActive
                ? 'bg-primary text-primary-content'
                : 'bg-slate-300 text-white'
            )}
            key={day}
          >
            {weekdayDict[day]}
          </div>
        );
      })}
    </div>
  );
};
