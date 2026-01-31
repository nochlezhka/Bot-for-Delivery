import { clsx } from 'clsx';
import { atom, useAtom, useAtomValue } from 'jotai';
import { user_role } from 'pickup-point-db/browser';
import { HTMLProps } from 'react';

import { RoleChips } from '@/entity/employee/ui';

const current = atom<user_role>(user_role.volunteer);

type UsersPageFiltersProps = HTMLProps<HTMLDivElement>;
export const UserRoleFilter = ({
  children,
  className,
}: UsersPageFiltersProps) => {
  const [pageRole, setCurrentRole] = useAtom(current);
  return (
    <div className={clsx(className, 'grid grid-cols-[1fr_auto] gap-2')}>
      <RoleChips
        className="col-start-1"
        defaultSelected={pageRole}
        onChange={setCurrentRole}
      />
      {children}
    </div>
  );
};

UserRoleFilter.useCurrentRole = () => useAtomValue(current);
