'use client';

import { Button } from '@telegram-apps/telegram-ui';
import { clsx } from 'clsx';
import { compareAsc } from 'date-fns/compareAsc';
import { format } from 'date-fns/format';
import { ru } from 'date-fns/locale/ru';
import React, { HTMLProps } from 'react';

import {
  AcceptTimeout,
  createWarningBorder,
  HalfBusyNotice,
  isAcceptAvailable,
} from '@/entity/shift';
import { api } from '@/trpc/client';

type SelectedShiftsProps = HTMLProps<HTMLDivElement>;

const WARNNING_BORDER = createWarningBorder();

export const SelectedShifts = ({ className }: SelectedShiftsProps) => {
  const { data: shiftList, refetch } = api.shift.getOwnShifts.useQuery();
  const { mutate: acceptShift } = api.shift.accept.useMutation({
    onSuccess: () => refetch(),
  });
  const { mutate: cancelShift } = api.shift.cancel.useMutation({
    onSuccess: () => refetch(),
  });
  return (
    <div className={clsx(className, 'space-y-2')}>
      {(shiftList ?? []).map(([shiftId, shift]) => {
        const isHalfBusy =
          shift.status !== 'busy' &&
          compareAsc(WARNNING_BORDER, shift.dateStart) > 0;
        const res = format(shift.dateStart, 'cccc, do MMMM', {
          locale: ru,
        });
        return (
          <div
            className={clsx(
              'w-full grow flex flex-col items-start rounded-md border-2 border-[var(--tgui--secondary_fill)] overflow-hidden p-2',
              isHalfBusy ? 'bg-red-900 !border-[red]' : null
            )}
            key={shiftId}
          >
            {res.at(0)?.toUpperCase() + res.slice(1)}
            {isHalfBusy ? <HalfBusyNotice className="mb-2" /> : null}
            {
              <AcceptTimeout
                dateStart={shift.dateStart}
                isAccepted={shift.accepted}
              />
            }
            {shift.accepted === false ? (
              <div className="grid grid-flow-col auto-cols-[min-content] gap-2 mt-6">
                {isAcceptAvailable(shift.dateStart) ? (
                  <Button size="m" onClick={() => acceptShift({ id: shiftId })}>
                    Подтвердить
                  </Button>
                ) : null}

                <Button size="m" onClick={() => cancelShift({ id: shiftId })}>
                  Отменить
                </Button>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
