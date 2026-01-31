import { clsx } from 'clsx';
import { HeartHandshake } from 'lucide-react';
import { HTMLProps } from 'react';

type HalfBusyNoticeProps = HTMLProps<HTMLDivElement>;

export const FreeNotice = ({ className }: HalfBusyNoticeProps) => {
  return (
    <div className={clsx(className, 'flex items-center badge badge-primary')}>
      <HeartHandshake size={16} />
      <p className="ml-1">Смена не занята!</p>
    </div>
  );
};
