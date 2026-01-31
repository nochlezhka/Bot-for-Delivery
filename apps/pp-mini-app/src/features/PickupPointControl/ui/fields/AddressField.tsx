'use client';
import type { project } from 'pickup-point-db/browser';

import { Editable } from '@ark-ui/react/editable';
import { useContext } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { PickupPointFormContext } from '../../Context';

export const AddressField = () => {
  const { control } = useFormContext<project>();
  const { field, fieldState } = useController({ control, name: 'address' });

  const { trigerFieldSubmit } = useContext(PickupPointFormContext);

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">Адрес</legend>
      <Editable.Root
        className="form-control"
        defaultValue={field.value ?? ''}
        onValueChange={({ value }) => field.onChange(value)}
        onValueCommit={trigerFieldSubmit.bind(null, 'address')}
        placeholder="Введите имя"
      >
        <Editable.Preview className="input input-bordered w-full data-placeholder-shown:text-base-content/30" />
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
