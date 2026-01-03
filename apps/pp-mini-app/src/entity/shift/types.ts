import { shift_status } from 'pickup-point-db/browser';
import { z } from 'zod';

import { volunteerShiftSchema } from './schema';

export interface ShiftPublicInfo {
  id: string;
  status: shift_status;
  accepted?: boolean | null;
}

export type ShiftsMap = Map<number, ShiftPublicInfo>;

export type VolunteerShift = z.infer<typeof volunteerShiftSchema>;
