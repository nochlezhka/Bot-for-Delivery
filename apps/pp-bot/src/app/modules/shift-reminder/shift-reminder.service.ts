import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { Inject } from '@nestjs/common';
import { Drizzle } from '../../drizzle';
import { schema } from 'pickup-point-db';
import { and, eq, lt, gt, InferSelectModel } from 'drizzle-orm';

import { confirmShift, declineShift } from './constant';

@Injectable()
export class ShiftReminderService {
  @Inject() private readonly drizzle!: Drizzle;
  private readonly logger = new Logger(ShiftReminderService.name);

  constructor(@InjectBot() private readonly bot: Telegraf) {}

  @Cron('*/1 * * * *') // every 15 minutes
  async handleEventReminders() {
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    type UserShiftWithUser = InferSelectModel<typeof schema.userShiftsTable> & {
      user: InferSelectModel<typeof schema.userTable>;
    };

    type ShiftWithUserShifts = InferSelectModel<typeof schema.shiftTable> & {
      userShifts: UserShiftWithUser[];
    };

    this.logger.log('Extracting upcoming shifts within the next 24 hours');
    const shifts: ShiftWithUserShifts[] = await this.drizzle.db.query.shiftTable.findMany({
      where: and(
        gt(schema.shiftTable.dateStart, now),
        lt(schema.shiftTable.dateStart, in24h)
      ),
      with: {
        userShifts: {
          where: eq(schema.userShiftsTable.confirmationRequestSent, false),
          with: {
            user: true,
          },
        },
      },
    });
    this.logger.log(`Extracted ${shifts.length} upcoming shifts`);

    for (const shift of shifts) {
      if (!shift.userShifts || shift.userShifts.length === 0) {
        this.logger.log(`No non-reminded users found for shift ${shift.title} with start date ${shift.dateStart}`);
        continue;
      }
      for (const userShift of shift.userShifts) {
        if (!userShift.user) continue;

        try {
          await this.sendShiftReminder(userShift.user.tgId.toString(), shift);
          await this.setConfirmationRequestSent(userShift.userId, shift.id);
          this.logger.log(`Sent reminder to ${userShift.user.tgId.toString()}`);
        } catch (err) {
          if (err instanceof Error) {
            this.logger.error(`Failed to send reminder: ${err.message}`);
          } else {
            this.logger.error('Failed to send reminder:', err);
          }
        }
      }
    }
  }

  async sendShiftReminder(userTgId: string, shift: InferSelectModel<typeof schema.shiftTable>) {
    const msg = `Напоминаю вам о смене ${shift.title}, начинающейся в ${new Date(shift.dateStart).toLocaleString()}, на которую вы записаны`;
    await this.bot.telegram.sendMessage(userTgId, msg, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Подтвердить', callback_data: `${confirmShift}:${shift.id}` },
            { text: '❌ Отменить', callback_data: `${declineShift}:${shift.id}` },
          ],
        ],
      },
    });
  }

  async setConfirmationRequestSent(userId: string, shiftId: string) {
    this.logger.debug(`Setting confirmation request sent for user ${userId} and shift ${shiftId}`);
    await this.drizzle.db.update(schema.userShiftsTable)
      .set({ confirmationRequestSent: true })
      .where(
        and(
          eq(schema.userShiftsTable.userId, userId),
          eq(schema.userShiftsTable.shiftId, shiftId)
        )
      );
  }
}
