import { clsx } from 'clsx';
import { atom, useAtom, useAtomValue } from 'jotai';
import { HTMLProps } from 'react';

import { NewUserDialog } from '@/app/employee/users/NewUserDialog';
import { RoleChips } from '@/entity/employee/ui';

import type { user_role } from 'pickup-point-db/browser';

const DEFAULT_SELECTED = 'volunteer';
const current = atom<user_role>(DEFAULT_SELECTED);

type UsersPageFiltersProps = HTMLProps<HTMLDivElement>;
export const UsersPageFilters = ({ className }: UsersPageFiltersProps) => {
  const [pageRole, setCurrentRole] = useAtom(current);
  return (
    <div className={clsx(className, 'grid grid-cols-[1fr_auto] gap-2')}>
      <RoleChips
        defaultSelected={pageRole}
        onChange={setCurrentRole}
        className="col-start-1"
      />
      <NewUserDialog className="col-start-2" />
    </div>
  );
};

UsersPageFilters.useCurrentRole = () => useAtomValue(current);
