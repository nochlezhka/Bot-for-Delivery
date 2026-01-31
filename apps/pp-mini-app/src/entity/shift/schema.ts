import { z } from 'zod';

const SHIFT_VALS = ['free', 'busy', 'halfBusy', 'weekend'] as const;
export const volunteerShiftSchema = z.union([
  z.object({
    accepted: z.boolean().nullable(),
    dateStart: z.date(),
    id: z.string().uuid().readonly(),
    status: z.enum(SHIFT_VALS).readonly(),
  }),
  z.object({
    accepted: z.undefined(),
    dateStart: z.date(),
  }),
]);
