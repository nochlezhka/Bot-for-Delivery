'use client';

import { atom } from 'jotai';
import { useAtomValue } from 'jotai/react';

import { isCoordinatorAtom } from '@/entity/coordinator/state';
import { isEmployeeAtom } from '@/entity/employee/state';
import { CoordinatorWorkShiftCalendar } from '@/widget/CoordinatorWorkShiftCalendar';
import { VolunteerWorkShiftCalendar } from '@/widget/VolunteerWorkShiftCalendar';

const isCoorinatorCalendarAtom = atom((get) => {
  return get(isEmployeeAtom) || get(isCoordinatorAtom);
});
export default function Home() {
  const isCoorinatorCalendar = useAtomValue(isCoorinatorCalendarAtom);
  return isCoorinatorCalendar ? (
    <CoordinatorWorkShiftCalendar />
  ) : (
    <VolunteerWorkShiftCalendar />
  );
}
