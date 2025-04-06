import { clsx } from 'clsx';
import { OctagonAlert } from 'lucide-react';
import React, { HTMLProps } from 'react';

interface HalfBusyNoticeProps extends HTMLProps<HTMLDivElement> {
  ownSelected?: boolean;
}

export const HalfBusyNotice = ({
  className,
  ownSelected,
}: HalfBusyNoticeProps) => {
  return (
    <div className={clsx(className, 'flex items-center')}>
      <OctagonAlert size={16} className="storoke-red-500" />
      <p className="ml-1">
        {ownSelected
          ? 'Осторожно, не полная смена!'
          : 'Не хватает участника смены!'}
      </p>
    </div>
  );
};
