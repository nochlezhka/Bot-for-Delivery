'use client';
import { atom, withActions } from '@reatom/core';

import { VolunteerShift } from '@/entity/shift';

import { VolunteerControlledShift } from './type';

export const volunterControllingShift = atom<VolunteerControlledShift>(null).extend(
  withActions((target) => ({
    clearShift: () => target.set(null),
    setupShift: (shift: VolunteerShift) => target.set(shift),
  }))
);
