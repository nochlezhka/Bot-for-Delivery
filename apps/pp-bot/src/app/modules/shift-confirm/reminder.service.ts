import { Inject, Injectable, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Interval } from '@nestjs/schedule';
import { and, eq } from 'drizzle-orm';
import { schema } from 'pickup-point-db';

import { ConfirmSubject } from './const';
import { RemindShiftsQuery } from './remind-shifts.query';
import { SendConfirmCommand } from '../../commands';
import { Drizzle } from '../../drizzle';
import { formatUserDate } from '../../util';

@Injectable()
export class ReminderService {
  @Inject() private readonly logger!: Logger;
  @Inject() private readonly drizzle!: Drizzle;
  @Inject() private readonly commandBus!: CommandBus;
  @Inject() private readonly queryBus!: QueryBus;

  @Interval(60000)
  async handleEventReminders() {
    this.logger.debug('Extracting upcoming shifts within the next 24 hours');
    const shifts = await this.queryBus.execute(new RemindShiftsQuery());
    this.logger.debug(`Extracted ${shifts.length} upcoming shifts`);

    for (const shift of shifts) {
      if (!shift.userShifts || shift.userShifts.length === 0) {
        this.logger.debug(
          `No non-reminded users found for shift ${shift.title} with start date ${shift.dateStart}`
        );
        continue;
      }
      for (const userShift of shift.userShifts) {
        if (userShift.user) {
          try {
            await this.commandBus.execute(
              new SendConfirmCommand(
                userShift.user.tgId.toString(),
                `Напоминаю вам о смене ${
                  shift.title
                }, начинающейся в ${formatUserDate(
                  shift.dateStart
                )}, на которую вы записаны`,
                ConfirmSubject,
                shift.id
              )
            );
            await this.drizzle.db
              .update(schema.userShiftsTable)
              .set({ confirmationRequestSent: true })
              .where(
                and(
                  eq(schema.userShiftsTable.userId, userShift.userId),
                  eq(schema.userShiftsTable.shiftId, userShift.shiftId)
                )
              );
            this.logger.debug(
              `Sent reminder to ${userShift.user.tgId.toString()}`
            );
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
  }
}
