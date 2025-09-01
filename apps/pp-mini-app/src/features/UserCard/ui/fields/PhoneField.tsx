'use client';
import { Editable } from '@ark-ui/react/editable';
import { useContext } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { usePhoneMask } from '@/entity/user/hooks/use-phone.mask';

import type { User } from 'pickup-point-db';

import { UserFormContext } from '../../Context';

export const PhoneField = () => {
  const { control } = useFormContext<User>();
  const { field, fieldState } = useController({ name: 'phone', control });

  const { trigerFieldSubmit } = useContext(UserFormContext);
  const inputRef = usePhoneMask();

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">Телефон</legend>
      <Editable.Root
        className="form-control"
        placeholder="Введите телефон"
        defaultValue={field.value ?? ''}
        onValueCommit={trigerFieldSubmit.bind(null, 'phone')}
        onValueChange={({ value }) => field.onChange(value)}
      >
        <Editable.Preview className="input input-bordered w-full data-[placeholder-shown]:text-base-content/30" />
        <Editable.Input
          ref={inputRef}
          className="input input-bordered w-full"
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
