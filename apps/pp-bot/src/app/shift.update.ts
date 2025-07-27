import { Inject, Logger, Param } from '@nestjs/common';
import { Action, Ctx, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { and, eq } from 'drizzle-orm';

import { schema } from 'pickup-point-db';

import { Drizzle } from './drizzle';


@Update()
export class ShiftUpdate {
  @Inject() private readonly drizzle!: Drizzle;
  private readonly logger = new Logger(ShiftUpdate.name);

  @Action(/^(confirm|reject)_shift:(.+)$/)
  async handleShiftAction(@Ctx() ctx: Context) {
    const cbq = ctx.callbackQuery;

    if (!cbq || !('data' in cbq) || !cbq.data) {
      this.logger.warn('No callback data found');
      return;
    }

    const data = cbq.data; // e.g., "confirm_shift:UUID"
    const match = data.match(/^(confirm|reject)_shift:(.+)$/);

    if (!match) {
      this.logger.warn(`Callback data didn't match expected pattern: ${data}`);
      return;
    }

    const action = match[1]; // "confirm" or "decline"
    const shiftId = match[2]; // the UUID

    this.logger.debug(`Action: ${action}, Shift ID: ${shiftId}`);

    const userId = ctx.from?.id;
    if (!userId) {
      this.logger.error(`User ID not found in context when confirming shift ${shiftId}`);
      return;
    }

    const user = await this.drizzle.db.query.userTable.findFirst({
      where: eq(schema.userTable.tgId, BigInt(userId)),
    });

    if (!user) {
      this.logger.error(`User with ID ${userId} not found when in users table while confirming shift ${shiftId}`);
      await ctx.reply('❌ Пользователь не найден. Похоже, вы не зарегистрированы в системе.');
      return;
    }

    const shift = await this.drizzle.db.query.shiftTable.findFirst({
      where: eq(schema.shiftTable.id, shiftId),
    });

    if (!shift) {
      this.logger.error(`Shift with ID ${shiftId} not found in shifts table`);
      await ctx.reply('❌ Смена не найдена. Пожалуйста, попробуйте позже.');
      return;
    }

    const status = action === 'confirm' ? true : false;
    await this.drizzle.db.update(schema.userShiftsTable)
      .set({ status })
      .where(
        and(
          eq(schema.userShiftsTable.userId, user.id),
          eq(schema.userShiftsTable.shiftId, shiftId)
        )
      );

    if (action === 'confirm') {
      // process confirmation
      await ctx.reply(`✅ Смена ${shift.dateStart} подтверждена. Спасибо за вашу помощь!`);
    } else if (action === 'decline') {
      // process decline
      await ctx.reply('❌ Смена отклонена. Спасибо за уведомление! Мы сообщим координаторам.');
    }
    await ctx.editMessageReplyMarkup(undefined); // removes the buttons

    await ctx.answerCbQuery('✅ Действие выполнено');
  }
}
