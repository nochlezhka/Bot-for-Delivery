'use client';
import { Editable } from '@ark-ui/react/editable';
import { useContext } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import type { project } from 'pickup-point-db/browser';

import { PickupPointFormContext } from '../../Context';

export const AddressField = () => {
  const { control } = useFormContext<project>();
  const { field, fieldState } = useController({ name: 'address', control });

  const { trigerFieldSubmit } = useContext(PickupPointFormContext);

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">Адрес</legend>
      <Editable.Root
        placeholder="Введите имя"
        defaultValue={field.value ?? ''}
        className="form-control"
        onValueCommit={trigerFieldSubmit.bind(null, 'address')}
        onValueChange={({ value }) => field.onChange(value)}
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
