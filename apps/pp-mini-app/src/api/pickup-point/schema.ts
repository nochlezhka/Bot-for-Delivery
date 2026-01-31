import { z } from 'zod';

export const createRequestSchema = z.object({
  // schedule: z.string({ message: 'Необходимо указать Расписание' }).nullable(),
  address: z.string({ message: 'Необходимо указать Адрес' }).nullable(),
  description: z.string({ message: 'Необходимо указать Описание' }).nullable(),
  name: z.string({ message: 'Необходимо указать Наименовнаие' }),
});

export const updateRequestSchema = createRequestSchema.partial().extend({
  id: z.string(),
});
