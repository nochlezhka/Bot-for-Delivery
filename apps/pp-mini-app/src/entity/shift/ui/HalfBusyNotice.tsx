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
          <OctagonAlert className="storoke-red-500" size={16} />
          <p className="ml-1">Осторожно, не полная смена!</p>
        </>
      ) : (
        <>
          <HeartHandshake className="storoke-red-500" size={16} />
          <p className="ml-1">Не хватает участника смены!</p>
        </>
      )}
    </div>
  );
};
