import type { user_role } from 'pickup-point-db/browser';

import { createListCollection } from '@ark-ui/react/collection';
import { Noop } from '@util/types';
import { clsx } from 'clsx';
import { HTMLProps } from 'react';

import { ROLE_LIST, ROLE_NAMES } from '@/entity/employee/constant';
import { SelectMenu } from '@/shared/ui/SelectMenu';

interface RoleSelectProps extends Omit<HTMLProps<HTMLDivElement>, 'onChange'> {
  defaultSelected?: user_role;
  disabled?: boolean;
  isLoading?: boolean;
  onChange?: (role: user_role) => ReturnType<Noop>;
}
const collection = createListCollection<user_role>({
  items: ROLE_LIST,
  itemToString: (item: user_role) => ROLE_NAMES[item],
});

export const RoleSelect = ({
  className,
  defaultSelected,
  disabled,
  isLoading,
  onChange,
}: RoleSelectProps) => (
  <SelectMenu
    className={clsx(className, 'flex')}
    collection={collection}
    disabled={disabled}
    isLoading={isLoading}
    onChange={(value) => onChange?.(value as user_role)}
    portaled
    value={defaultSelected}
  />
);
