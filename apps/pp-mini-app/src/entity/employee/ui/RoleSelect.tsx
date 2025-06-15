import { HTMLProps } from 'react';

import { ROLE_LIST, ROLE_NAMES } from '@/entity/employee/constant';
import { Noop } from '@/shared/types';

import type { UserRoles } from 'pickup-point-db';

interface RoleSelectProps extends Omit<HTMLProps<HTMLDivElement>, 'onChange'> {
  isLoading?: boolean;
  defaultSelected: UserRoles;
  onChange?: (role: UserRoles) => ReturnType<Noop>;
}

export const RoleSelect = ({
  isLoading,
  defaultSelected,
  onChange,
}: RoleSelectProps) => {
  return (
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend">Роль</legend>
      <select
        className="select select-sm"
        disabled={isLoading}
        value={defaultSelected}
        onChange={(event) =>
          onChange && onChange(event.currentTarget.value as UserRoles)
        }
      >
        {ROLE_LIST.map((role) => (
          <option key={role} value={role}>
            {ROLE_NAMES[role]}
          </option>
        ))}
      </select>
    </fieldset>
  );
};
