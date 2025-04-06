import { atom } from 'jotai/index';

import { roleAtom } from '../user/state';

export const isCoordinatorAtom = atom((get) => {
  const role = get(roleAtom);
  let result = null;
  if (role) {
    result = role === 'coordinator';
  }
  return result;
});
