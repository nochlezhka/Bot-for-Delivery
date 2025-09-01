'use client';
import { HTMLProps, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { merge } from 'remeda';
import { noop } from 'rxjs';
import z from 'zod';

import { createRequestSchema } from '@/api/user/schema';
import { createUserResolver } from '@/entity/user/resolver';

import type { Noop } from '@/shared/types';
import type { NewUser } from 'pickup-point-db';

import { UserFormContext } from '../Context';

type formData = NewUser;
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
    resolver: createUserResolver,
    defaultValues: merge(
      { tgId: null, tgUsername: null },
      defaultValues as formResult
    ),
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
