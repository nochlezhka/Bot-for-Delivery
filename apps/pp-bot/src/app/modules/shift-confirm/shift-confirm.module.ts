import { Logger, Module } from '@nestjs/common';

import { RemindShiftsQueryHandler } from './remind-shifts.query';
import { ReminderService } from './reminder.service';
import { ShiftConfirmUpdate } from './shift-confirm.update';

@Module({
  providers: [
    ShiftConfirmUpdate,
    ReminderService,
    RemindShiftsQueryHandler,
    Logger,
  ],
})
export class ShiftConfirmModule {}
