'use client';
import type { Noop } from '@util/types';

import { clsx } from 'clsx';
import { project } from 'pickup-point-db/client';
import { HTMLProps, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { noop } from 'rxjs';
import z from 'zod';

import { createRequestSchema } from '@/api/pickup-point/schema';
import { createPickupPointResolver } from '@/entity/pickup-point/resolver';

import { PickupPointFormContext } from '../Context';

export interface CreateFormProviderProps
  extends Omit<HTMLProps<HTMLDivElement>, 'onSubmit'> {
  defaultValues?: Partial<formData>;
  onSubmit?: (data: formResult) => ReturnType<Noop>;
}
type formData = project;

type formResult = z.infer<typeof createRequestSchema>;

export const CreateFormProvider = ({
  children,
  className,
  defaultValues,
  onSubmit,
}: CreateFormProviderProps) => {
  const form = useForm({
    defaultValues: defaultValues as formResult,
    resolver: createPickupPointResolver,
  });
  const submitAction = useMemo(
    () => form.handleSubmit((data) => onSubmit?.(data)),
    [form, onSubmit]
  );

  return (
    <FormProvider {...form}>
      <PickupPointFormContext.Provider value={{ trigerFieldSubmit: noop }}>
        <form className={clsx(className, 'pt-0 ')} onSubmit={submitAction}>
          {children}
        </form>
      </PickupPointFormContext.Provider>
    </FormProvider>
  );
};
