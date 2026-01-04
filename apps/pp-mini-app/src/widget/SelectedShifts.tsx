'use client';

import { clsx } from 'clsx';
import { compareAsc } from 'date-fns/compareAsc';
import { format } from 'date-fns/format';
import { ru } from 'date-fns/locale/ru';
import { HTMLProps } from 'react';

import { AcceptTimeout } from '@/entity/shift/ui/AcceptTimeout';
import { HalfBusyNotice } from '@/entity/shift/ui/HalfBusyNotice';
import { createWarningBorder, isAcceptAvailable } from '@/entity/shift/util';
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
              'card card-xs card-border shadow-sm',
              isHalfBusy ? 'bg-red-900' : null
            )}
            key={shiftId}
          >
            <div className="card-body">
              <div className="card-title">
                {res.at(0)?.toUpperCase() + res.slice(1)}
              </div>
              {isHalfBusy ? <HalfBusyNotice className="mb-2" /> : <></>}
              <p>
                {
                  <AcceptTimeout
                    dateStart={shift.dateStart}
                    isAccepted={shift.accepted}
                  />
                }
              </p>
              <div className="card-actions">
                {shift.accepted === false ? (
                  <>
                    {isAcceptAvailable(shift.dateStart) ? (
                      <button
                        className="btn btn-sm"
                        onClick={() => acceptShift({ id: shiftId })}
                      >
                        Подтвердить
                      </button>
                    ) : (
                      <></>
                    )}

                    <button
                      className="btn btn-sm"
                      onClick={() => cancelShift({ id: shiftId })}
                    >
                      Отменить
                    </button>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
