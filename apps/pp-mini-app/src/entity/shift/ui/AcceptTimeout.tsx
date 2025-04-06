import { Subheadline } from '@telegram-apps/telegram-ui';
import { Info } from 'lucide-react';
import React from 'react';

import { ShiftTimer } from './ShiftTimer';
import { acceptAvailableDate, isAcceptAvailable } from '../util';

interface AcceptTimeoutProps {
  isAccepted?: boolean | null;
  dateStart: Date;
}

export const AcceptTimeout = ({
  isAccepted,
  dateStart,
}: AcceptTimeoutProps) => {
  let result = <></>;
  if (isAccepted || typeof isAccepted !== 'boolean') {
    result = (
      <div className="flex flex-col">
        <Subheadline className="!mb-1" level="1" weight="1">
          До смены осталось:
        </Subheadline>
        <ShiftTimer date={dateStart} />
      </div>
    );
  } else {
    if (isAcceptAvailable(dateStart)) {
      result = (
        <div className="flex flex-col">
          <Subheadline className="!mb-1" level="1" weight="1">
            До смены осталось:
          </Subheadline>
          <ShiftTimer date={dateStart} />
          <div className="flex items-center mt-2">
            <Info size={16} />
            <p className="ml-1">Пожалуйста, подтвердите смену</p>
          </div>
        </div>
      );
    } else {
      result = (
        <div className="flex flex-col">
          <Subheadline className="!mr-1" level="1" weight="1">
            Подтверждение смены станет доступным через:
          </Subheadline>
          <ShiftTimer date={acceptAvailableDate(dateStart)} />
        </div>
      );
    }
  }
  return result;
};
