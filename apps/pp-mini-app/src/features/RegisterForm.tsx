'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  ButtonCell,
  Cell,
  Input,
  Radio,
  Section,
  Snackbar,
} from '@telegram-apps/telegram-ui';
import { HTMLProps, LegacyRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useIMask } from 'react-imask';

import { registerRequestSchema } from '@/api/user/schema';
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
  const { handleSubmit, resetField, control } = useForm({ resolver });
  const submitAction = handleSubmit(async (data) => {
    try {
      await mutateAsync(data);
    } catch (error) {
      console.log({ error });
    }
  });
  const { ref } = useIMask({
    mask: '+{7}(000)000-00-00',
  });

  return (
    <form onSubmit={submitAction} className={className}>
      <Section header="Регистрация в пункте выдаче">
        <Controller
          control={control}
          render={({ field, fieldState }) => (
            <>
              <Input
                ref={ref as LegacyRef<HTMLInputElement>}
                status={fieldState.error ? 'error' : undefined}
                name="phone"
                header="Телефон для связи"
                placeholder="Введите номер телефона"
                onChange={(e) => field.onChange(e.target.value)}
              />
              {fieldState.error?.message ? (
                <Snackbar
                  title={'Ошибка регистрации'}
                  duration={100000}
                  after={
                    <Snackbar.Button onClick={() => resetField('phone')}>
                      Понятно
                    </Snackbar.Button>
                  }
                  onClose={() => resetField('phone')}
                >
                  {fieldState.error?.message}
                </Snackbar>
              ) : null}
            </>
          )}
          name="phone"
        />
        <Controller
          control={control}
          render={({ field, fieldState }) => (
            <>
              <Cell
                Component="label"
                before={
                  <Radio
                    onChange={() => field.onChange('male')}
                    value="male"
                    name="gender"
                  />
                }
              >
                Мужской
              </Cell>
              <Cell
                Component="label"
                before={
                  <Radio
                    onChange={() => field.onChange('female')}
                    value="female"
                    name="gender"
                  />
                }
              >
                Женский
              </Cell>
              {fieldState.error?.message ? (
                <Snackbar
                  title={'Ошибка регистрации'}
                  duration={100000}
                  after={
                    <Snackbar.Button onClick={() => resetField('gender')}>
                      Понятно
                    </Snackbar.Button>
                  }
                  onClose={() => resetField('gender')}
                >
                  {fieldState.error?.message}
                </Snackbar>
              ) : null}
            </>
          )}
          name="gender"
        />

        <ButtonCell>Зарегистрироваться</ButtonCell>
      </Section>
    </form>
  );
};
