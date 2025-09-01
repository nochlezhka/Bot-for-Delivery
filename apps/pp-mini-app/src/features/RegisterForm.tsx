'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { HTMLProps } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { registerRequestSchema } from '@/api/user/schema';
import { usePhoneMask } from '@/entity/user/hooks/use-phone.mask';
import { Noop } from '@/shared/types';
import { api } from '@/trpc/client';

interface RegisterFormProps extends HTMLProps<HTMLFormElement> {
  onSuccess?: Noop;
}

const resolver = zodResolver(registerRequestSchema);

export const RegisterForm = ({ onSuccess, className }: RegisterFormProps) => {
  const { mutateAsync } = api.user.register.useMutation({
    onSuccess,
  });
  const { handleSubmit, control } = useForm({ resolver });
  const submitAction = handleSubmit(async (data) => {
    try {
      await mutateAsync(data);
    } catch (error) {
      console.log({ error });
    }
  });
  const inputRef = usePhoneMask();

  return (
    <form onSubmit={submitAction} className={className}>
      <div>
        Регистрация в пункте выдаче
        <Controller
          control={control}
          render={({ field, fieldState }) => (
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Телефон для связи</legend>
              <input
                className={clsx(
                  'input input-lg',
                  fieldState.error ? 'input-error' : undefined
                )}
                ref={inputRef}
                placeholder="Введите номер телефона"
                onChange={(e) => field.onChange(e.target.value)}
              />
              {fieldState.error?.message ? (
                <span>{fieldState.error?.message}</span>
              ) : null}
            </fieldset>
          )}
          name="phone"
        />
        <Controller
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <div className="badge badge-primary gap-1">
                <input
                  type="radio"
                  onChange={() => field.onChange('male')}
                  value="male"
                  name="gender"
                />
                Мужской
              </div>
              <div className="badge badge-primary gap-1">
                <input
                  type="radio"
                  onChange={() => field.onChange('female')}
                  value="female"
                  name="gender"
                />
                Женский
              </div>
              {fieldState.error?.message ? (
                <span className="text-error">{fieldState.error?.message}</span>
              ) : null}
            </div>
          )}
          name="gender"
        />
        <button type="submit" className="btn">
          Зарегистрироваться
        </button>
      </div>
    </form>
  );
};
