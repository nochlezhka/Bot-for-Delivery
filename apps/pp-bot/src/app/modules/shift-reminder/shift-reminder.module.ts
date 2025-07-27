import { Module } from '@nestjs/common';
import { ShiftReminderService } from './shift-reminder.service';

@Module({
  providers: [ShiftReminderService]
})
export class ShiftReminderModule {}
