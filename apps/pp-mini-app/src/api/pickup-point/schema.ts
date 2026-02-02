import { z } from 'zod';

export const projectTaskSchema = z.object({
  gender: z.enum(['male', 'female']).nullable().optional(),
  is_active: z.boolean().default(true),
  name: z.string({ message: 'Необходимо указать Наименование задачи' }),
  schedule: z.string({ message: 'Необходимо указать Расписание (RRULE)' }),
});
export const projectSchema = z.object({
  address: z.string({ message: 'Необходимо указать Адрес' }).nullable(),
  description: z.string({ message: 'Необходимо указать Описание' }).nullable(),
  name: z.string({ message: 'Необходимо указать Наименовнаие' }),
});

export const createRequestSchema = projectSchema.extend({
  projectTasks: z.array(projectTaskSchema).optional(),
});

export const updateRequestSchema = projectSchema.partial().extend({
  id: z.string(),
  projectTasks: z
    .array(
      projectTaskSchema.partial().extend({
        id: z.string().optional(),
      })
    )
    .optional(),
});
