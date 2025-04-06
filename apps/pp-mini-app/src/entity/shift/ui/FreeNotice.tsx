import { clsx } from 'clsx';
import { OctagonAlert } from 'lucide-react';
import React, { HTMLProps } from 'react';

type HalfBusyNoticeProps = HTMLProps<HTMLDivElement>;

export const FreeNotice = ({ className }: HalfBusyNoticeProps) => {
  return (
    <div className={clsx(className, 'flex items-center')}>
      <OctagonAlert size={16} className="storoke-red-500" />
      <p className="ml-1">Смена не занята!</p>
    </div>
  );
};
