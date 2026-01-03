'use client';
import { Noop } from '@util/types';
import { clsx } from 'clsx';
import { HTMLProps } from 'react';

import type { user_role } from 'pickup-point-db/browser';

import { ROLE_LIST, ROLE_NAMES } from '../constant';

interface RoleChipsProps extends Omit<HTMLProps<HTMLDivElement>, 'onChange'> {
  defaultSelected: user_role;
  onChange?: (role: user_role) => ReturnType<Noop>;
}

export const RoleChips = ({
  defaultSelected,
  onChange,
  className,
}: RoleChipsProps) => {
  const selectAciton = (val: user_role) => {
    if (onChange) {
      onChange(val);
    }
  };
  return (
    <div className={clsx(className, 'flex flex-wrap gap-2 h-min')}>
      {ROLE_LIST.map((val) => (
        <label className="badge badge-primary gap-1 cursor-pointer" key={val}>
          <input
            type="radio"
            value={val}
            defaultChecked={val === defaultSelected}
            onChange={selectAciton.bind(null, val)}
            name="role"
          />
          {ROLE_NAMES[val]}
        </label>
      ))}
    </div>
  );
};
