'use client';
import { Editable } from '@ark-ui/react/editable';
import { useContext } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import type { User } from 'pickup-point-db';

import { UserFormContext } from '../../Context';

export const NameField = () => {
  const { control } = useFormContext<User>();
  const { field, fieldState } = useController({ name: 'name', control });

  const { trigerFieldSubmit } = useContext(UserFormContext);

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">Имя</legend>
      <Editable.Root
        placeholder="Введите имя"
        defaultValue={field.value ?? ''}
        className="form-control"
        onValueCommit={trigerFieldSubmit.bind(null, 'name')}
        onValueChange={({ value }) => field.onChange(value)}
      >
        <Editable.Preview className="input input-bordered w-full data-[placeholder-shown]:text-base-content/30" />
        <Editable.Input className="input input-bordered w-full" />
      </Editable.Root>
      {fieldState.error?.message ? (
        <div className="text-error">{fieldState.error.message}</div>
      ) : (
        <></>
      )}
    </fieldset>
  );
};
