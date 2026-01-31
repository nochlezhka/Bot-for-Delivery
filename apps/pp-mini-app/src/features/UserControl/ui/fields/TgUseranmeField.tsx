'use client';
import type { users } from 'pickup-point-db/browser';

import { Editable } from '@ark-ui/react/editable';
import { useContext } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { useTgLinkMask } from '@/entity/user/hooks/use-tg-link.mask';

import { UserFormContext } from '../../Context';

export const TgUseranmeField = () => {
  const { control } = useFormContext<users>();
  const { field, fieldState } = useController({ control, name: 'tg_username' });

  const { trigerFieldSubmit } = useContext(UserFormContext);
  const maskedInput = useTgLinkMask();

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">TgUsername</legend>
      <Editable.Root
        className="form-control"
        defaultValue={field.value ?? ''}
        onValueChange={({ value }) => field.onChange(value)}
        onValueCommit={trigerFieldSubmit.bind(null, 'tg_username')}
        placeholder="Введите ссылку на пользователя"
      >
        <Editable.Preview className="input input-bordered w-full data-[placeholder-shown]:text-base-content/30" />
        <Editable.Input
          className="input input-bordered w-full"
          ref={maskedInput}
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
