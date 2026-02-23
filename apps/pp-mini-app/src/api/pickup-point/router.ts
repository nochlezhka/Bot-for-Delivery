import { keys } from 'remeda';

import { createTRPCRouter, employeeProcedure } from '@/server/api/trpc';

import { createRequestSchema, updateRequestSchema } from './schema';

export const pickupPointEmployeeRouter = createTRPCRouter({
  createOne: employeeProcedure
    .input(createRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const { projectTasks, ...projectData } = input;

      await ctx.db.task.create({
        data: {
          ...projectData,
          schedules: projectTasks?.length
            ? {
                createMany: {
                  data: projectTasks.map((v) => ({ name: 'Смена', ...v })),
                },
              }
            : undefined,
        },
      });
    }),
  getList: employeeProcedure.query(async ({ ctx }) =>
    ctx.db.task.findMany({
      orderBy: { id: 'desc' },
      include: { schedules: true },
    })
  ),
  updateOne: employeeProcedure
    .input(updateRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, projectTasks, ...projectData } = input;

      await ctx.db.$transaction(async (tx) => {
        if (keys(projectData).length > 0) {
          await tx.task.update({
            data: projectData,
            where: { id },
          });
        }
        if (projectTasks && projectTasks.length > 0) {
          type pt = typeof projectTasks;

          const { tasksToCreate, tasksToUpdate } = projectTasks.reduce(
            (res, cur) => {
              if (cur.id === undefined && typeof cur.schedule === 'string') {
                res.tasksToCreate.push(cur as any);
              } else {
                res.tasksToUpdate.push(cur);
              }
              return res;
            },
            {
              tasksToCreate: new Array<
                { schedule: string } & Omit<pt, 'schedule'>
              >(),
              tasksToUpdate: [] as pt,
            }
          );

          for (const task of tasksToUpdate) {
            const { id: taskId, ...taskData } = task;
            await tx.task_schedule.update({
              data: taskData,
              where: { id: taskId },
            });
          }

          if (tasksToCreate.length > 0) {
            await tx.task_schedule.createMany({
              data: tasksToCreate.map((task) => ({
                ...task,
                name: '',
                task_id: id,
              })),
            });
          }
        }
      });
    }),
});
