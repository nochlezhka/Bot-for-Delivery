import { z } from 'zod';

export const shiftRangeRequest = z.object({
  start: z.date().optional(),
  end: z.date().optional(),
});

export const shiftSignUpRequest = z.object({
  selectedDate: z.date(),
});
export const shiftAction = z.object({
  id: z.string().uuid(),
});
