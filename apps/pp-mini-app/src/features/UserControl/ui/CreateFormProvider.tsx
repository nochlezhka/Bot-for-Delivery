'use client';
import type { Noop } from '@util/types';
import type { users } from 'pickup-point-db/browser';

import { HTMLProps, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { merge } from 'remeda';
import { noop } from 'rxjs';
import z from 'zod';

import { createRequestSchema } from '@/api/user/schema';
import { createUserResolver } from '@/entity/user/resolver';

import { UserFormContext } from '../Context';

export interface CreateFormProviderProps
  extends Omit<HTMLProps<HTMLDivElement>, 'onSubmit'> {
  defaultValues?: Partial<formData>;
  onSubmit?: (data: formResult) => ReturnType<Noop>;
}
type formData = users;

type formResult = z.infer<typeof createRequestSchema>;

export const CreateFormProvider = ({
  children,
  defaultValues,
  onSubmit,
}: CreateFormProviderProps) => {
  const form = useForm({
    defaultValues: merge(
      { tgId: null, tgUsername: null },
      defaultValues as formResult
    ),
    resolver: createUserResolver,
  });
  const submitAction = useMemo(
    () => form.handleSubmit((data) => onSubmit?.(data)),
    [form, onSubmit]
  );

  return (
    <FormProvider {...form}>
      <UserFormContext.Provider value={{ trigerFieldSubmit: noop }}>
        <form onSubmit={submitAction}>{children}</form>
      </UserFormContext.Provider>
    </FormProvider>
  );
};
