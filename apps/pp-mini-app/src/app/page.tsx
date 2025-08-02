'use client';

import { useEffect } from 'react';

import { api } from '@/trpc/client';
import { VolunteerWorkShiftCalendar } from '@/widget/VolunteerWorkShiftCalendar';

export default function Home() {
  const { data } = api.rpc.ping.useQuery();
  useEffect(() => {
    console.log(data);
  }, [data]);
  return <VolunteerWorkShiftCalendar />;
}
