import { reatomComponent } from '@reatom/react';
import { Noop } from '@util/types';
import { FileText, MapPin, Pencil, Users } from 'lucide-react';

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
        </div>
        <button className="btn btn-sm btn-primary shrink-0" onClick={onClick}>
          <Pencil className="h-4 w-4 mr-1" />
        </button>
      </div>
    </div>
  );
}, 'TaskView');
