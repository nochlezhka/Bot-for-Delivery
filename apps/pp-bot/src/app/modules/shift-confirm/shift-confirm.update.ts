import { Inject, Logger } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { Action, Ctx, Update } from 'nestjs-telegraf';
import { schema } from 'pickup-point-db';
import { Context } from 'telegraf';

import { ConfirmSubject } from './const';
import {
  getSubjectConfirmData,
  getSubjectConfirmPattern,
  ShiftAction,
} from '../../commands';
import { Drizzle } from '../../drizzle';
import { formatUserDate } from '../../util';

@Update()
export class ShiftConfirmUpdate {
  @Inject() private readonly drizzle!: Drizzle;
  @Inject() readonly logger!: Logger;

  @Action(getSubjectConfirmPattern(ConfirmSubject))
  async handleShiftAction(@Ctx() ctx: Context) {
    const cbq = ctx.callbackQuery;
    const dto =
      cbq && 'data' in cbq && cbq.data ? getSubjectConfirmData(cbq.data) : null;
    let user;
    if (ctx.from?.id) {
      user = await this.drizzle.db.query.userTable.findFirst({
        where: eq(schema.userTable.tgId, BigInt(ctx.from.id)),
      });
      if (!user) {
        this.logger.error(
          `User with ID ${ctx.from.id} not found when in users table while confirming shift`
        );
        await ctx.reply(
          '❌ Пользователь не найден. Похоже, вы не зарегистрированы в системе.'
        );
      }
    } else {
      this.logger.error(`User ID not found in context when confirming shift`);
    }
    if (dto !== null && user) {
      const { action, data: shiftId } = dto;
      this.logger.debug(`Action: ${action}, Shift ID: ${shiftId}`);

      const shift = await this.drizzle.db.query.shiftTable.findFirst({
        where: eq(schema.shiftTable.id, shiftId),
      });

      if (shift) {
        await this.drizzle.db
          .update(schema.userShiftsTable)
          .set({ status: action === ShiftAction.Confirm })
          .where(
            and(
              eq(schema.userShiftsTable.userId, user.id),
              eq(schema.userShiftsTable.shiftId, shiftId)
            )
          );

        switch (action) {
          case ShiftAction.Confirm:
            await ctx.reply(
              `✅ Смена ${formatUserDate(
                shift.dateStart
              )} подтверждена. Спасибо за вашу помощь!`
            );
            break;
          case ShiftAction.Decline:
            await ctx.reply(
              `❌ Смена ${formatUserDate(
                shift.dateStart
              )} отклонена. Спасибо за уведомление! Мы сообщим координаторам.`
            );
            break;
          default:
            this.logger.warn(`Unhandled action: ${action}`);
        }
        await ctx.editMessageReplyMarkup(undefined);
        await ctx.answerCbQuery('✅ Действие выполнено');
      } else {
        this.logger.error(`Shift with ID ${shiftId} not found in shifts table`);
        await ctx.reply('❌ Смена не найдена. Пожалуйста, попробуйте позже.');
      }
    }
  }
}
