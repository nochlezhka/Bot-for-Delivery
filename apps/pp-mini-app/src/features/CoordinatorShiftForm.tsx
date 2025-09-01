'use client';

import { useForm } from 'react-hook-form';

import { VolunteerShift } from '@/entity/shift/types';
import { Noop } from '@/shared/types';

interface CoordinatorShiftFormProps {
  shift: VolunteerShift;
  onActionComplete?: Noop;
}

export const CoordinatorShiftForm = ({
  shift,
  onActionComplete,
}: CoordinatorShiftFormProps) => {
  const onSuccess = () => onActionComplete && onActionComplete();

  const form = useForm({
    defaultValues: shift,
  });
  const submitAction = form.handleSubmit(async (data) => {
    await onSuccess?.();
  });

  return <form className="flex flex-col" onSubmit={submitAction}></form>;
};
