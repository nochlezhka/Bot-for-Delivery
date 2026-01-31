import { Inject, Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Interval } from '@nestjs/schedule';
import { sprintf } from 'sprintf-js';

import { SendConfirmCommand } from '../../commands';
import { PrismaDb } from '../../prisma';
import { formatUserDate } from '../../util';
import { ShiftConfirmSubject } from './const';

@Injectable()
export class ReminderService {
  @Inject() private readonly commandBus!: CommandBus;
  @Inject() private readonly db!: PrismaDb;
  @Inject() private readonly logger!: Logger;

  @Interval(60000)
  async handleEventReminders() {
    this.logger.debug('Extracting upcoming shifts within the next 24 hours');
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const result = new Array<{ shift_id: string; user_id: string; }>();
    const userShifts = await this.db.user_shifts_table.findMany({
      select: {
        shift: {
          select: {
            date_start: true,
            title: true,
          },
        },
        shift_id: true,
        user_id: true,
        users: {
          select: {
            tg_id: true,
          },
        },
      },
      where: {
        shift: {
          date_start: {
            gt: now,
            lt: in24h,
          },
        },
      },
    });
    this.logger.debug(
      `Extracted ${userShifts.length} upcoming shift reminders`
    );

    for (const {
      shift: { date_start, title },
      shift_id,
      user_id,
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
        result.push({ shift_id, user_id });
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
        data: {
          confirmation_request_sent: true,
        },
        where: {
          OR: result,
        },
      });
    }
  }
}
