import { Logger, Module } from '@nestjs/common';

import { ReminderService } from './reminder.service';
import { ShiftConfirmUpdate } from './shift-confirm.update';

@Module({
  providers: [ShiftConfirmUpdate, ReminderService, Logger],
})
export class ShiftConfirmModule {}
