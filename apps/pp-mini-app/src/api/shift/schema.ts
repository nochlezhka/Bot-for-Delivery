import { z } from 'zod';

export const shiftRangeRequest = z.object({
  end: z.date().optional(),
  start: z.date().optional(),
  taskId: z.string().uuid(),
});

export const shiftSignUpRequest = z.object({
  selectedDate: z.date(),
});
export const shiftAction = z.object({
  id: z.string().uuid(),
});
