import { createListCollection } from '@ark-ui/react/collection';
import { Noop } from '@util/types';
import { clsx } from 'clsx';
import { HTMLProps } from 'react';

import { ROLE_LIST, ROLE_NAMES } from '@/entity/employee/constant';
import { SelectMenu } from '@/shared/ui/SelectMenu';

import type { user_role } from 'pickup-point-db/browser';

interface RoleSelectProps extends Omit<HTMLProps<HTMLDivElement>, 'onChange'> {
  isLoading?: boolean;
  disabled?: boolean;
  defaultSelected?: user_role;
  onChange?: (role: user_role) => ReturnType<Noop>;
}
const collection = createListCollection<user_role>({
  items: ROLE_LIST,
  itemToString: (item: user_role) => ROLE_NAMES[item],
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
    onChange={(value) => onChange?.(value as user_role)}
    isLoading={isLoading}
    disabled={disabled}
    className={clsx(className, 'flex')}
  />
);
