'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Noop } from '@util/types';
import clsx from 'clsx';
import { HTMLProps } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { registerRequestSchema } from '@/api/user/schema';
import { usePhoneMask } from '@/entity/user/hooks/use-phone.mask';
import { api } from '@/trpc/client';

interface RegisterFormProps extends HTMLProps<HTMLFormElement> {
  onSuccess?: Noop;
}

const resolver = zodResolver(registerRequestSchema);

export const GuestRegister = ({ className, onSuccess }: RegisterFormProps) => {
  const { isPending, mutateAsync } = api.user.register.useMutation({
    onSuccess,
  });
  const { control, handleSubmit } = useForm({ resolver });
  const submitAction = handleSubmit(async (data) => {
    try {
      await mutateAsync(data);
    } catch (error) {
      console.log({ error });
    }
  });
  const inputRef = usePhoneMask();

  return (
    <form
      className={clsx(
        className,
        'flex flex-col justify-center overflow-hidden'
      )}
      onSubmit={submitAction}
    >
      <div className="flex flex-col justify-center relative px-5">
        <div className="flex flex-col items-center absolute bottom-[calc(100%+5vh)] left-1/2 -translate-x-1/2">
          <div className="inline-flex perspective-origin-[bottom_center] perspective-[40px]">
            <p className="text-[10vh] font-bold uppercase  text-right shadow-[1px,1px,10px,#000] self-end leading-none origin-[center_top] rotate-x-[-20deg]">
              Пункт
            </p>
          </div>
          <div className="inline-flex perspective-origin-[top_center] perspective-[40px]">
            <p className="text-[10vh] font-bold uppercase leading-none origin-[center_bottom] rotate-x-[35deg]">
              выдачи
            </p>
          </div>
          <p className="text-sm font-bold lowercase mt-5">Регистрация</p>
        </div>
        <Controller
          control={control}
          name="phone"
          render={({ field, fieldState }) => (
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">Телефон для связи</legend>
              <input
                className={clsx(
                  'input input-lg w-full',
                  fieldState.error ? 'input-error' : undefined
                )}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder="Введите номер телефона"
                ref={inputRef}
              />
              {fieldState.error?.message ? (
                <span>{fieldState.error?.message}</span>
              ) : null}
            </fieldset>
          )}
        />
        <Controller
          control={control}
          name="gender"
          render={({ field, fieldState }) => (
            <div className="flex gap-x-2 gap-y-1 mt-5">
              <label className="badge badge-xl badge-primary gap-1 ">
                <input
                  name="gender"
                  onChange={() => field.onChange('male')}
                  type="radio"
                  value="male"
                />
                Мужской
              </label>
              <label className="badge badge-xl badge-primary gap-1">
                <input
                  name="gender"
                  onChange={() => field.onChange('female')}
                  type="radio"
                  value="female"
                />
                Женский
              </label>
              {fieldState.error?.message ? (
                <span className="text-error">{fieldState.error?.message}</span>
              ) : null}
            </div>
          )}
        />
        <button
          className={clsx(
            isPending ? 'btn-disabled' : null,
            'btn btn-primary fixed bottom-[10px] w-[calc(100%-40px)] !left-1/2 !-translate-x-1/2'
          )}
          type="submit"
        >
          {isPending ? <span className="loading loading-spinner"></span> : null}
          Зарегистрироваться
        </button>
      </div>
    </form>
  );
};
