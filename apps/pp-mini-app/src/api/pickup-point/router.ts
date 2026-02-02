import { keys } from 'remeda';

import { createTRPCRouter, employeeProcedure } from '@/server/api/trpc';

import { createRequestSchema, updateRequestSchema } from './schema';

export const pickupPointEmployeeRouter = createTRPCRouter({
  createOne: employeeProcedure
    .input(createRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const { projectTasks, ...projectData } = input;

      await ctx.db.project.create({
        data: {
          ...projectData,
          projectTasks: projectTasks?.length
            ? {
                createMany: { data: projectTasks },
              }
            : undefined,
        },
      });
    }),
  getList: employeeProcedure.query(async ({ ctx }) =>
    ctx.db.project.findMany({ orderBy: { id: 'desc' } })
  ),
  updateOne: employeeProcedure
    .input(updateRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, projectTasks, ...projectData } = input;

      await ctx.db.$transaction(async (tx) => {
        if (keys(projectData).length > 0) {
          await tx.project.update({
            data: projectData,
            where: { id },
          });
        }
        if (projectTasks && projectTasks.length > 0) {
          type pt = typeof projectTasks;

          const { tasksToCreate, tasksToUpdate } = projectTasks.reduce(
            (res, cur) => {
              if (cur.id === undefined) {
                res.tasksToCreate.push(cur);
              } else {
                res.tasksToUpdate.push(cur);
              }
              return res;
            },
            { tasksToCreate: [] as pt, tasksToUpdate: [] as pt }
          );

          for (const task of tasksToUpdate) {
            const { id: taskId, ...taskData } = task;
            await tx.project_task.update({
              data: taskData,
              where: { id: taskId },
            });
          }

          if (tasksToCreate.length > 0) {
            await tx.project_task.createMany({
              data: tasksToCreate.map((task) => ({
                ...task,
                project_id: id,
              })),
            });
          }
        }
      });
    }),
});
