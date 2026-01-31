'use client';
import type { project } from 'pickup-point-db/browser';

import { Editable } from '@ark-ui/react/editable';
import { useContext } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { PickupPointFormContext } from '../../Context';

export const DescriptionField = () => {
  const { control } = useFormContext<project>();
  const { field, fieldState } = useController({ control, name: 'description' });

  const { trigerFieldSubmit } = useContext(PickupPointFormContext);

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">Описание</legend>
      <Editable.Root
        className="form-control"
        defaultValue={field.value ?? ''}
        onValueChange={({ value }) => field.onChange(value)}
        onValueCommit={trigerFieldSubmit.bind(null, 'description')}
        placeholder="Введите имя"
      >
        <Editable.Preview
          asChild
          className="textarea w-full data-placeholder-shown:text-base-content/30"
        >
          <textarea readOnly style={{ resize: 'none' }} />
        </Editable.Preview>
        <Editable.Input
          asChild
          className="textarea w-full"
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
