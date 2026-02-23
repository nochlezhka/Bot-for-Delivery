import { reatomComponent } from '@reatom/react';
import { Noop } from '@util/types';
import { Calendar, FileText, MapPin, Pencil, Users } from 'lucide-react';

import { GenderIcon } from '@/entity/task/ui/GenderIcon';
import { GenderName } from '@/entity/task/ui/GenderName';
import { ScheduleView } from '@/entity/task/ui/ScheduleView';

import { Task } from '../model/taskModel';

interface TaskViewProps {
  onClick?: Noop;
  task: Task;
}

export const TaskView = reatomComponent<TaskViewProps>(({ onClick, task }) => {
  return (
    <div className="p-4 border rounded-lg bg-base-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg truncate empty:hidden">
            {task.name}
          </h3>

          {task.address && (
            <div className="flex items-start gap-2 mt-2">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
              <p className="text-sm text-gray-600">{task.address}</p>
            </div>
          )}

          {task.description && (
            <div className="flex items-start gap-2 mt-2">
              <FileText className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
              <p className="text-sm text-gray-500 line-clamp-2">
                {task.description}
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>Макс. участников: {task.max_participant}</span>
            </div>
          </div>

          {task.schedules && task.schedules.length > 0 && (
            <div className="mt-4 space-y-3 w-full">
              <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Расписание
              </h4>
              {task.schedules.map((schedule) => (
                <div
                  className="bg-gray-50 rounded-lg p-3 space-y-2"
                  key={schedule.id}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      <span className="font-medium text-sm">
                        {schedule.name}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-500 lowercase">
                        <GenderIcon gender={schedule.gender} />
                        <GenderName gender={schedule.gender} />
                      </div>
                    </div>
                    <span
                      className={`badge badge-sm ${
                        schedule.is_active ? 'badge-success' : 'badge-ghost'
                      }`}
                    >
                      {schedule.is_active ? 'Активно' : 'Не активно'}
                    </span>
                  </div>
                  <ScheduleView schedule={schedule.schedule} />
                </div>
              ))}
            </div>
          )}
        </div>
        <button className="btn btn-sm btn-primary shrink-0" onClick={onClick}>
          <Pencil className="h-4 w-4 mr-1" />
        </button>
      </div>
    </div>
  );
}, 'TaskView');
