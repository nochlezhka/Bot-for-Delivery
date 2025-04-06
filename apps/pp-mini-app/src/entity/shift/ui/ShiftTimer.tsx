import { Timer } from '@ark-ui/react';
import { HTMLProps } from 'react';

interface ShiftTimerProps extends HTMLProps<HTMLDivElement> {
  date: Date;
}

export const ShiftTimer = ({ className, date }: ShiftTimerProps) => (
  <Timer.Root
    className={className}
    startMs={date.getTime() - new Date().getTime()}
    targetMs={0}
    autoStart
    countdown
  >
    <Timer.Area className="grid gap-2 grid-flow-col auto-cols-[min-content]">
      <div className="flex items-end">
        <Timer.Item type="days" />
        <Timer.Separator className="ml-0.5 text-sm">д</Timer.Separator>
      </div>
      <div className="flex items-end">
        <Timer.Item type="hours" />
        <Timer.Separator className="ml-0.5 text-sm">ч</Timer.Separator>
      </div>
      <div className="flex items-end">
        <Timer.Item type="minutes" />
        <Timer.Separator className="ml-0.5 text-sm">м</Timer.Separator>
      </div>
      <div className="flex items-end">
        <Timer.Item type="seconds" />
        <Timer.Separator className="ml-0.5 text-sm">с</Timer.Separator>
      </div>
    </Timer.Area>
  </Timer.Root>
);
