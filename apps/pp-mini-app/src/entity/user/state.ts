import { getQueryKey } from '@trpc/react-query';
import { atom } from 'jotai';
import { atomWithQuery } from 'jotai-tanstack-query';

import { api, RouterOutputs } from '@/trpc/client';

const profileAtom = atomWithQuery<RouterOutputs['user']['profile']>(() => ({
  queryKey: getQueryKey(api.user.profile, undefined, 'query'),
}));

export const roleAtom = atom((get) => {
  const { data } = get(profileAtom);
  return data?.role ?? null;
});
