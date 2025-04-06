'use client';
import { Chip, Radio } from '@telegram-apps/telegram-ui';
import { clsx } from 'clsx';
import { HTMLProps } from 'react';

import { Noop } from '@/shared/types';

import type { UserRoles } from 'pickup-point-db';

import { ROLE_LIST, ROLE_NAMES } from '../constant';

interface RoleChipsProps extends Omit<HTMLProps<HTMLDivElement>, 'onChange'> {
  defaultSelected: UserRoles;
  onChange?: (role: UserRoles) => ReturnType<Noop>;
}

export const RoleChips = ({
  defaultSelected,
  onChange,
  className,
}: RoleChipsProps) => {
  const selectAciton = (val: UserRoles) => {
    if (onChange) {
      onChange(val);
    }
  };
  return (
    <div className={clsx(className, 'flex flex-wrap gap-2 h-min')}>
      {ROLE_LIST.map((val) => (
        <Chip
          key={val}
          mode="elevated"
          Component="label"
          before={
            <Radio
              name="role"
              value={val}
              defaultChecked={val === defaultSelected}
              onChange={selectAciton.bind(null, val)}
            />
          }
        >
          {ROLE_NAMES[val]}
        </Chip>
      ))}
    </div>
  );
};
