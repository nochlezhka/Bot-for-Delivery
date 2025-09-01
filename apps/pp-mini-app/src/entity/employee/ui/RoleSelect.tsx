import { createListCollection } from '@ark-ui/react/collection';
import { clsx } from 'clsx';
import { HTMLProps } from 'react';

import { ROLE_LIST, ROLE_NAMES } from '@/entity/employee/constant';
import { Noop } from '@/shared/types';
import { SelectMenu } from '@/shared/ui/SelectMenu';

import type { UserRoles } from 'pickup-point-db';

interface RoleSelectProps extends Omit<HTMLProps<HTMLDivElement>, 'onChange'> {
  isLoading?: boolean;
  disabled?: boolean;
  defaultSelected?: UserRoles;
  onChange?: (role: UserRoles) => ReturnType<Noop>;
}
const collection = createListCollection<UserRoles>({
  items: ROLE_LIST,
  itemToString: (item: UserRoles) => ROLE_NAMES[item],
});

export const RoleSelect = ({
  isLoading,
  disabled,
  defaultSelected,
  onChange,
  className,
}: RoleSelectProps) => (
  <SelectMenu
    portaled
    collection={collection}
    value={defaultSelected}
    onChange={(value) => onChange?.(value as UserRoles)}
    isLoading={isLoading}
    disabled={disabled}
    className={clsx(className, 'flex')}
  />
);
