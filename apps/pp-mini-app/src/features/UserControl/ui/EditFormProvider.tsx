'use client';
import type { Noop } from '@util/types';
import type { users } from 'pickup-point-db/browser';

import { HTMLProps, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { pick } from 'remeda';
import { z } from 'zod';

import { updateRequestSchema } from '@/api/user/schema';
import { updateUserResolver } from '@/entity/user/resolver';

import { UserFormContext } from '../Context';

export interface EditFormProviderProps
  extends Omit<HTMLProps<HTMLDivElement>, 'onSubmit'> {
  autoresetOnError?: boolean;
  defaultValues?: formData;
  onSubmit?: (data: formResult) => ReturnType<Noop>;
}
type formData = { id: string } & Omit<users, 'pickup_id'>;

type formResult = z.infer<typeof updateRequestSchema>;

export const EditFormProvider = ({
  autoresetOnError,
  children,
  className,
  defaultValues,
  onSubmit,
}: EditFormProviderProps) => {
  const form = useForm({
    defaultValues,
    resolver: updateUserResolver,
  });

  const submitAction: (
    v?: keyof Omit<users, 'project_id'>
  ) => ReturnType<Noop> = useMemo(
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
