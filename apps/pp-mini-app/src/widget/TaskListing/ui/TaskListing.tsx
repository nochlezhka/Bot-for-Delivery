import { reatomComponent } from '@reatom/react';
import { clsx } from 'clsx';
import { CircleAlert, Loader2 } from 'lucide-react';
import { HTMLProps, ReactNode } from 'react';

import { Task, tasksResource } from '../model/taskModel';
import { TaskView } from './TaskView';

type TaskListingProps = HTMLProps<HTMLDivElement>;

export const TaskListing = reatomComponent(
  ({ className }: TaskListingProps) => {
    const isReady = tasksResource.ready();
    const error = tasksResource.error();
    const tasks = tasksResource.data();

    let result: ReactNode;

    if (!isReady) {
      result = (
        <>
          <Loader2 className="animate-spin" />
          <span className="ml-2">Загрузка...</span>
        </>
      );
    } else if (error) {
      result = (
        <>
          <CircleAlert />
          <span className="ml-2">Ошибка: {error.message}</span>
        </>
      );
    } else if (tasks.length === 0) {
      result = (
        <>
          <CircleAlert />
          <span className="ml-2">Пунктов выдачи нет</span>
        </>
      );
    } else {
      result = tasks.map((task: Task) => (
        <TaskView key={task.id} task={task} />
      ));
    }

    return (
      <div
        className={clsx(
          className,
          'h-full flex grow',
          isReady && !error && tasks.length > 0
            ? 'flex-col gap-2 p-4'
            : 'items-center justify-center',
          error && 'text-red-500'
        )}
      >
        {result}
      </div>
    );
  },
  'TaskListing'
);
