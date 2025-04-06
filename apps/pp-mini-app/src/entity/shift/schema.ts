import { z } from 'zod';

const SHIFT_VALS = ['free', 'busy', 'halfBusy', 'weekend'] as const;
export const volunteerShiftSchema = z.union([
  z.object({
    id: z.string().uuid().readonly(),
    status: z.enum(SHIFT_VALS).readonly(),
    dateStart: z.date(),
    accepted: z.boolean().nullable(),
  }),
  z.object({
    dateStart: z.date(),
    accepted: z.undefined(),
  }),
]);
