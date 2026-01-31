import { Inject, Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Interval } from '@nestjs/schedule';
import { sprintf } from 'sprintf-js';

import { ShiftConfirmSubject } from './const';
import { SendConfirmCommand } from '../../commands';
import { PrismaDb } from '../../prisma';
import { formatUserDate } from '../../util';

@Injectable()
export class ReminderService {
  @Inject() private readonly logger!: Logger;
  @Inject() private readonly db!: PrismaDb;
  @Inject() private readonly commandBus!: CommandBus;

  @Interval(60000)
  async handleEventReminders() {
    this.logger.debug('Extracting upcoming shifts within the next 24 hours');
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const result = new Array<{ user_id: string; shift_id: string }>();
    const userShifts = await this.db.user_shifts_table.findMany({
      where: {
        shift: {
          date_start: {
            gt: now,
            lt: in24h,
          },
        },
      },
      select: {
        user_id: true,
        shift_id: true,
        shift: {
          select: {
            title: true,
            date_start: true,
          },
        },
        users: {
          select: {
            tg_id: true,
          },
        },
      },
    });
    this.logger.debug(
      `Extracted ${userShifts.length} upcoming shift reminders`
    );

    for (const {
      shift_id,
      user_id,
      shift: { title, date_start },
      users: { tg_id },
    } of userShifts) {
      try {
        if (tg_id) {
          await this.commandBus.execute(
            new SendConfirmCommand(
              tg_id.toString(),
              sprintf(
                'Напоминаю вам о смене %s, на которую вы записаны %s',
                title,
                formatUserDate(date_start)
              ),
              ShiftConfirmSubject,
              shift_id
            )
          );
          this.logger.debug(`Sent reminder to ${user_id}`);
        } else {
          this.logger.debug(`Skip reminder to ${user_id}`);
        }
        result.push({ user_id, shift_id });
      } catch (err) {
        if (err instanceof Error) {
          this.logger.error(`Failed to send reminder: ${err.message}`);
        } else {
          this.logger.error('Failed to send reminder:', err);
        }
      }
    }
    if (result.length > 0) {
      await this.db.user_shifts_table.updateMany({
        where: {
          OR: result,
        },
        data: {
          confirmation_request_sent: true,
        },
      });
    }
  }
}
