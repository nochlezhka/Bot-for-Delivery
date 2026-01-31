'use client';
import { clsx } from 'clsx';
import { HTMLProps, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { pick } from 'remeda';
import { z } from 'zod';

import { updateRequestSchema } from '@/api/pickup-point/schema';
import { updatePickupPointResolver } from '@/entity/pickup-point/resolver';

import type { Noop } from '@util/types';
import type { project } from 'pickup-point-db/browser';

import { PickupPointFormContext } from '../Context';

type formData = project;
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
    resolver: updatePickupPointResolver,
  });

  const submitAction: (v?: keyof formData) => ReturnType<Noop> = useMemo(
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
      <PickupPointFormContext.Provider
        value={{
          trigerFieldSubmit: submitAction,
        }}
      >
        <form
          className={clsx(className, 'pt-0')}
          onSubmit={() => submitAction()}
        >
          {children}
        </form>
      </PickupPointFormContext.Provider>
    </FormProvider>
  );
};
