import { atom } from 'jotai/index';

import { roleAtom } from '../user/state';

export const isVolunteerAtom = atom((get) => {
  const role = get(roleAtom);
  let result = null;
  if (role) {
    result = role === 'volunteer';
  }
  return result;
});
