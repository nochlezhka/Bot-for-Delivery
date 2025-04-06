import { Select, Spinner } from '@telegram-apps/telegram-ui';
import { HTMLProps } from 'react';

import { Noop } from '@/shared/types';

import type { UserRoles } from 'pickup-point-db';

import { ROLE_LIST, ROLE_NAMES } from '../constant';

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
    <Select
      className="w-full"
      disabled={isLoading}
      before={isLoading ? <Spinner size="s" /> : null}
      value={defaultSelected}
      header="Роль"
      onChange={(event) =>
        onChange && onChange(event.currentTarget.value as UserRoles)
      }
    >
      {ROLE_LIST.map((role) => (
        <option key={role} value={role}>
          {ROLE_NAMES[role]}
        </option>
      ))}
    </Select>
  );
};
