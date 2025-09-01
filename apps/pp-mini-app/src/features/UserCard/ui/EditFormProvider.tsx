'use client';
import { HTMLProps, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { pick } from 'remeda';
import { z } from 'zod';

import { updateRequestSchema } from '@/api/user/schema';
import { updateUserResolver } from '@/entity/user/resolver';

import type { Noop } from '@/shared/types';
import type { User } from 'pickup-point-db';

import { UserFormContext } from '../Context';

type formData = Partial<User> & { id: string };
type formResult = z.infer<typeof updateRequestSchema>;

export interface EditFormProviderProps
  extends Omit<HTMLProps<HTMLDivElement>, 'onSubmit'> {
  onSubmit?: (data: formResult) => ReturnType<Noop>;
  defaultValues?: formData;
  autoresetOnError?: boolean;
}

export const EditFormProvider = ({
  className,
  defaultValues,
  onSubmit,
  children,
  autoresetOnError,
}: EditFormProviderProps) => {
  const form = useForm({
    defaultValues,
    resolver: updateUserResolver,
  });

  const submitAction: (v?: keyof User) => ReturnType<Noop> = useMemo(
    () => (key) => {
      form.handleSubmit(
        (data) => {
          let result = data;
          if (key) {
            result = pick(data, [key, 'id']);
          }
          onSubmit?.(result);
        },
        () => {
          if (autoresetOnError) {
            //TODO: доработь авторесет
            form.reset(defaultValues, { keepErrors: true });
          }
        }
      )();
    },
    [autoresetOnError, defaultValues, form, onSubmit]
  );

  return (
    <FormProvider {...form}>
      <UserFormContext.Provider
        value={{
          trigerFieldSubmit: submitAction,
        }}
      >
        <form className={className} onSubmit={() => submitAction()}>
          {children}
        </form>
      </UserFormContext.Provider>
    </FormProvider>
  );
};
