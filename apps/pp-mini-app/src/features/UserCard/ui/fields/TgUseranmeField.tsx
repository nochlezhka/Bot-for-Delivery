'use client';
import { Editable } from '@ark-ui/react/editable';
import { useContext } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { useTgLinkMask } from '@/entity/user/hooks/use-tg-link.mask';

import type { User } from 'pickup-point-db';

import { UserFormContext } from '../../Context';

export const TgUseranmeField = () => {
  const { control } = useFormContext<User>();
  const { field, fieldState } = useController({ name: 'tgUsername', control });

  const { trigerFieldSubmit } = useContext(UserFormContext);
  const maskedInput = useTgLinkMask();

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">TgUsername</legend>
      <Editable.Root
        className="form-control"
        placeholder="Введите ссылку на пользователя"
        defaultValue={field.value ?? ''}
        onValueCommit={trigerFieldSubmit.bind(null, 'tgUsername')}
        onValueChange={({ value }) => field.onChange(value)}
      >
        <Editable.Preview className="input input-bordered w-full data-[placeholder-shown]:text-base-content/30" />
        <Editable.Input
          ref={maskedInput}
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
