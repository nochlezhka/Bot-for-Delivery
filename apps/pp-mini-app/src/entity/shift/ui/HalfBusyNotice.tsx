import { clsx } from 'clsx';
import { HeartHandshake, OctagonAlert } from 'lucide-react';
import { HTMLProps } from 'react';

interface HalfBusyNoticeProps extends HTMLProps<HTMLDivElement> {
  ownSelected?: boolean;
}

export const HalfBusyNotice = ({
  className,
  ownSelected,
}: HalfBusyNoticeProps) => {
  return (
    <div className={clsx(className, 'flex items-center badge badge-warning')}>
      {ownSelected ? (
        <>
          <OctagonAlert size={16} className="storoke-red-500" />
          <p className="ml-1">Осторожно, не полная смена!</p>
        </>
      ) : (
        <>
          <HeartHandshake size={16} className="storoke-red-500" />
          <p className="ml-1">Не хватает участника смены!</p>
        </>
      )}
    </div>
  );
};
