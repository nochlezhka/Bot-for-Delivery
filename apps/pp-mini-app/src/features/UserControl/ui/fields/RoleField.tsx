'use client';
import type { users } from 'pickup-point-db/browser';

import { useContext } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { RoleSelect } from '@/entity/employee/ui';

import { UserFormContext } from '../../Context';

export const RoleField = () => {
  const { control } = useFormContext<users>();
  const { field, fieldState } = useController({ control, name: 'role' });

  const { trigerFieldSubmit } = useContext(UserFormContext);

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">Роль</legend>
      <RoleSelect
        className="form-control"
        defaultSelected={field.value}
        onChange={async (role) => {
          field.onChange(role);
          trigerFieldSubmit('role');
        }}
      />

      {fieldState.error?.message ? (
        <div className="text-error">{fieldState.error.message}</div>
      ) : (
        <></>
      )}
    </fieldset>
  );
};
