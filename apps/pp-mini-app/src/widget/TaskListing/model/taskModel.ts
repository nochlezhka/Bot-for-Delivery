import { action, computed, wrap } from '@reatom/core';
import { withAsyncData } from '@reatom/core';

import { RouterInputs } from '@/trpc/client';
import { trpcVanilla } from '@/trpc/vanilla-client';

export type Task = Awaited<
  ReturnType<typeof trpcVanilla.eployee.pp.getList.query>
>[number];
export type UpdateTaskInput = RouterInputs['eployee']['pp']['updateOne'];

export const tasksResource = computed(async () => {
  return await wrap(trpcVanilla.eployee.pp.getList.query());
}, 'tasksResource').extend(withAsyncData({ initState: [] as Task[] }));

export const updateTask = action(async (input: UpdateTaskInput) => {
  await wrap(trpcVanilla.eployee.pp.updateOne.mutate(input));
  tasksResource.abort();
}, 'updateTask');

export const refetchTasks = action(() => tasksResource.abort(), 'refetchTasks');
