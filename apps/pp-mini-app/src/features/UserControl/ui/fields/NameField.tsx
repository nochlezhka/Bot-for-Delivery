'use client';
import type { users } from 'pickup-point-db/browser';

import { Editable } from '@ark-ui/react/editable';
import { useContext } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { UserFormContext } from '../../Context';

export const NameField = () => {
  const { control } = useFormContext<users>();
  const { field, fieldState } = useController({ control, name: 'name' });

  const { trigerFieldSubmit } = useContext(UserFormContext);

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">Имя</legend>
      <Editable.Root
        className="form-control"
        defaultValue={field.value ?? ''}
        onValueChange={({ value }) => field.onChange(value)}
        onValueCommit={trigerFieldSubmit.bind(null, 'name')}
        placeholder="Введите имя"
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
