import { clsx } from 'clsx';
import { atom, useAtom, useAtomValue } from 'jotai';
import { HTMLProps } from 'react';

import { NewUserDialog } from '@/app/employee/users/NewUserDialog';
import { RoleChips } from '@/entity/employee/ui';

import type { UserRoles } from 'pickup-point-db';

const DEFAULT_SELECTED = 'volunteer';
const current = atom<UserRoles>(DEFAULT_SELECTED);

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
