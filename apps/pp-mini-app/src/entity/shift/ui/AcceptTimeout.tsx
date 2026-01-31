import { Info } from 'lucide-react';

import { acceptAvailableDate, isAcceptAvailable } from '../util';
import { ShiftTimer } from './ShiftTimer';

interface AcceptTimeoutProps {
  dateStart: Date;
  isAccepted?: boolean | null;
}

const getStartMs = (dateStart: Date) =>
  dateStart.getTime() - new Date().getTime();

export const AcceptTimeout = ({
  dateStart,
  isAccepted,
}: AcceptTimeoutProps) => {
  let result = <></>;

  if (isAccepted || typeof isAccepted !== 'boolean') {
    result = (
      <>
        <span>До смены осталось:</span>
        <ShiftTimer className="mt-1" startMs={getStartMs(dateStart)} />
      </>
    );
  } else {
    if (isAcceptAvailable(dateStart)) {
      result = (
        <>
          <span>До смены осталось:</span>
          <ShiftTimer className="mt-1" startMs={getStartMs(dateStart)} />
          <div className="flex items-center mt-1">
            <Info size={16} />
            <p className="ml-1">Пожалуйста, подтвердите смену</p>
          </div>
        </>
      );
    } else {
      result = (
        <>
          <span>Подтверждение смены станет доступным через:</span>
          <ShiftTimer
            className="mt-1"
            startMs={getStartMs(acceptAvailableDate(dateStart))}
          />
        </>
      );
    }
  }

  return <div className="flex flex-col">{result}</div>;
};
