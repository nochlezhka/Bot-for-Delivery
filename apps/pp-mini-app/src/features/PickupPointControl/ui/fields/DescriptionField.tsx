'use client';
import { Editable } from '@ark-ui/react/editable';
import { useContext } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import type { pickup_point } from 'pickup-point-db/browser';

import { PickupPointFormContext } from '../../Context';

export const DescriptionField = () => {
  const { control } = useFormContext<pickup_point>();
  const { field, fieldState } = useController({ name: 'description', control });

  const { trigerFieldSubmit } = useContext(PickupPointFormContext);

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">Описание</legend>
      <Editable.Root
        placeholder="Введите имя"
        defaultValue={field.value ?? ''}
        className="form-control"
        onValueCommit={trigerFieldSubmit.bind(null, 'description')}
        onValueChange={({ value }) => field.onChange(value)}
      >
        <Editable.Preview
          className="textarea w-full data-placeholder-shown:text-base-content/30"
          asChild
        >
          <textarea readOnly style={{ resize: 'none' }} />
        </Editable.Preview>
        <Editable.Input
          className="textarea w-full"
          asChild
          style={{ resize: 'none' }}
        >
          <textarea />
        </Editable.Input>
      </Editable.Root>
      {fieldState.error?.message ? (
        <div className="text-error">{fieldState.error.message}</div>
      ) : (
        <></>
      )}
    </fieldset>
  );
};
