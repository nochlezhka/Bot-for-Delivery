'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { volunteerShiftSchema } from '@/entity/shift/schema';
import { VolunteerShift } from '@/entity/shift/types';
import { AcceptTimeout } from '@/entity/shift/ui/AcceptTimeout';
import { FreeNotice } from '@/entity/shift/ui/FreeNotice';
import { HalfBusyNotice } from '@/entity/shift/ui/HalfBusyNotice';
import { isAcceptAvailable } from '@/entity/shift/util';
import { Noop } from '@/shared/types';
import { api } from '@/trpc/client';

const resolver = zodResolver(volunteerShiftSchema);

interface VolunteerShiftFormProps {
  shift: VolunteerShift;
  onActionComplete?: Noop;
}

export const VolunteerShiftForm = ({
  shift,
  onActionComplete,
}: VolunteerShiftFormProps) => {
  const onSuccess = () => onActionComplete && onActionComplete();

  const { mutate: signUpShift } = api.shift.signUp.useMutation({
    onSuccess,
  });
  const { mutate: acceptShift } = api.shift.accept.useMutation({
    onSuccess,
  });
  const { mutate: cancelShift } = api.shift.cancel.useMutation({
    onSuccess,
  });
  const form = useForm({
    resolver,
    defaultValues: shift,
  });
  const submitAction = form.handleSubmit((data) => {
    if ('id' in data) {
      if (data.accepted === null) {
        signUpShift({ selectedDate: data.dateStart });
      } else {
        acceptShift({ id: data.id });
      }
    } else {
      signUpShift({ selectedDate: data.dateStart });
    }
  });
  const cancelAction = async () => {
    const id = form.getValues('id');
    if (id) {
      cancelShift({ id });
    }
  };

  return (
    <form className="flex flex-col" onSubmit={submitAction}>
      <Controller
        control={form.control}
        name="dateStart"
        render={({ field }) => {
          let notification = <></>;
          if (typeof form.getValues('accepted') === 'boolean') {
            if (
              form.getValues('status') &&
              form.getValues('status') === 'halfBusy'
            ) {
              notification = <HalfBusyNotice className="mt-2" ownSelected />;
            }
          } else if (form.getValues('status')) {
            if (form.getValues('status') === 'halfBusy') {
              notification = <HalfBusyNotice className="mt-2" />;
            } else if (form.getValues('status') === 'free') {
              notification = <FreeNotice className="mt-2" />;
            }
          } else {
            notification = <FreeNotice className="mt-2" />;
          }
          return (
            <>
              <AcceptTimeout
                dateStart={field.value}
                isAccepted={form.getValues('accepted')}
              />
              {notification}
            </>
          );
        }}
      />
      <Controller
        control={form.control}
        name="accepted"
        render={({ field }) => {
          let result = <></>;
          if (field.value === undefined || field.value === null) {
            result = (
              <button className="btn btn-md btn-primary mt-6" type="submit">
                Записаться
              </button>
            );
          } else if (field.value === false) {
            result = (
              <div className="mt-6 flex flex-col">
                {isAcceptAvailable(form.getValues('dateStart')) ? (
                  <button
                    className="btn btn-md btn-primary !mb-2"
                    type="submit"
                  >
                    Подтвердить
                  </button>
                ) : null}
                <button
                  className="btn btn-md btn-primary"
                  type="button"
                  onClick={cancelAction}
                >
                  Отменить
                </button>
              </div>
            );
          }
          return result;
        }}
      />
    </form>
  );
};
