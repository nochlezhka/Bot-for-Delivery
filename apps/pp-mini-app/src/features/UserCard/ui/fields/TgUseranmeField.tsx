'use client';
import { Editable } from '@ark-ui/react/editable';
import { maskitoPrefixPostprocessorGenerator } from '@maskito/kit';
import { useMaskito } from '@maskito/react';
import { useContext } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import type { MaskitoOptions, MaskitoPreprocessor } from '@maskito/core';
import type { User } from 'pickup-point-db';

import { UserFormContext } from '../../Context';

// t.me/username, telegram.me/username, @username, + хвосты типа ?start=...
const TG_USERNAME_RE =
  /^(?:https?:\/\/)?(?:t(?:elegram)?\.me\/)?@?([a-z0-9_]{1,32})(?:[/?].*)?$/i;
// Если хочешь поддержать deeplink вида tg://resolve?domain=username, то:
// /^(?:(?:https?:\/\/)?(?:t(?:elegram)?\.me\/)|tg:\/\/resolve\?domain=)?@?([a-z0-9_]{1,32})(?:[/?].*)?$/i

const normalizeInput: MaskitoPreprocessor = ({ elementState, data }) => {
  if (typeof data !== 'string') return { elementState, data };

  const trimmed = data.trim();
  const m = trimmed.match(TG_USERNAME_RE);
  if (m) {
    // вставили ссылку или @username — оставляем только username
    return { elementState, data: m[1].toLowerCase() };
  }

  // печатают по символу — просто фильтруем шум
  const cleaned = trimmed.toLowerCase().replace(/[^a-z0-9_]/g, '');
  return { elementState, data: cleaned };
};

const options: MaskitoOptions = {
  // так как постпроцессор сам добавит префикс '@', в маске '@' не нужен
  mask: /^[a-z0-9_]{0,32}$/,
  preprocessors: [normalizeInput],
  postprocessors: [maskitoPrefixPostprocessorGenerator('@')],
};

export const TgUseranmeField = () => {
  const { control } = useFormContext<User>();
  const { field, fieldState } = useController({ name: 'tgUsername', control });

  const { trigerFieldSubmit } = useContext(UserFormContext);
  const maskedInput = useMaskito({ options });

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
