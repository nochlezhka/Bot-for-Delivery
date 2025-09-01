'use client';
import { useContext } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { RoleSelect } from '@/entity/employee/ui';
import { UserFormContext } from '@/features/UserCard/Context';

import type { User } from 'pickup-point-db';

export const RoleField = () => {
  const { control } = useFormContext<User>();
  const { field, fieldState } = useController({ name: 'role', control });

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
