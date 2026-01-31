'use client';
import type { users } from 'pickup-point-db/browser';

import { Editable } from '@ark-ui/react/editable';
import { useContext } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { usePhoneMask } from '@/entity/user/hooks/use-phone.mask';

import { UserFormContext } from '../../Context';

export const PhoneField = () => {
  const { control } = useFormContext<users>();
  const { field, fieldState } = useController({ control, name: 'phone' });

  const { trigerFieldSubmit } = useContext(UserFormContext);
  const inputRef = usePhoneMask();

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">Телефон</legend>
      <Editable.Root
        className="form-control"
        defaultValue={field.value ?? ''}
        onValueChange={({ value }) => field.onChange(value)}
        onValueCommit={trigerFieldSubmit.bind(null, 'phone')}
        placeholder="Введите телефон"
      >
        <Editable.Preview className="input input-bordered w-full data-[placeholder-shown]:text-base-content/30" />
        <Editable.Input
          className="input input-bordered w-full"
          ref={inputRef}
        />
      </Editable.Root>
      {fieldState.error?.message ? (
        <div className="text-error">{fieldState.error.message}</div>
      ) : (
        <></>
      )}
    </fieldset>
  );
};
