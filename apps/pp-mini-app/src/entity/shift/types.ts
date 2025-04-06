import { ShiftStatus } from 'pickup-point-db';
import { z } from 'zod';

import { volunteerShiftSchema } from './schema';

export interface ShiftPublicInfo {
  id: string;
  status: ShiftStatus;
  accepted?: boolean | null;
}

export type ShiftsMap = Map<number, ShiftPublicInfo>;

export type VolunteerShift = z.infer<typeof volunteerShiftSchema>;
