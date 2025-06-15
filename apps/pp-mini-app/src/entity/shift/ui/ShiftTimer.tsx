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
      <div className="flex items-end gap-0.5">
        <div className="countdown">
          <Timer.Item type="days" />
        </div>
        <Timer.Separator className="leading-none">д</Timer.Separator>
      </div>
      <div className="flex items-end gap-0.5">
        <div className="countdown">
          <Timer.Item type="hours" />
        </div>
        <Timer.Separator className="leading-none">ч</Timer.Separator>
      </div>
      <div className="flex items-end gap-0.5">
        <div className="countdown">
          <Timer.Item type="minutes" />
        </div>
        <Timer.Separator className="leading-none">м</Timer.Separator>
      </div>
      <div className="flex items-end gap-0.5">
        <div className="countdown">
          <Timer.Item type="seconds" />
        </div>
        <Timer.Separator className="leading-none">с</Timer.Separator>
      </div>
    </Timer.Area>
  </Timer.Root>
);
