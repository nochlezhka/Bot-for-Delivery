'use client';
import { pickup_point } from 'pickup-point-db/client';
import { HTMLProps, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { noop } from 'rxjs';
import z from 'zod';

import { createRequestSchema } from '@/api/pickup-point/schema';
import { createPickupPointResolver } from '@/entity/pickup-point/resolver';

import type { Noop } from '@util/types';

import { PickupPointFormContext } from '../Context';

type formData = pickup_point;
type formResult = z.infer<typeof createRequestSchema>;

export interface CreateFormProviderProps
  extends Omit<HTMLProps<HTMLDivElement>, 'onSubmit'> {
  onSubmit?: (data: formResult) => ReturnType<Noop>;
  defaultValues?: Partial<formData>;
}

export const CreateFormProvider = ({
  defaultValues,
  onSubmit,
  children,
}: CreateFormProviderProps) => {
  const form = useForm({
    resolver: createPickupPointResolver,
    defaultValues: defaultValues as formResult,
  });
  const submitAction = useMemo(
    () => form.handleSubmit((data) => onSubmit?.(data)),
    [form, onSubmit]
  );

  return (
    <FormProvider {...form}>
      <PickupPointFormContext.Provider value={{ trigerFieldSubmit: noop }}>
        <form onSubmit={submitAction}>{children}</form>
      </PickupPointFormContext.Provider>
    </FormProvider>
  );
};
