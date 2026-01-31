import { Inject, Logger } from '@nestjs/common';
import { Action, Ctx, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';

import {
  getSubjectConfirmData,
  getSubjectConfirmPattern,
  ShiftAction,
} from '../../commands';
import { PrismaDb } from '../../prisma';
import { formatUserDate } from '../../util';
import { ShiftConfirmSubject } from './const';

@Update()
export class ShiftConfirmUpdate {
  @Inject() readonly logger!: Logger;
  @Inject() private readonly db!: PrismaDb;

  @Action(getSubjectConfirmPattern(ShiftConfirmSubject))
  async handleShiftAction(@Ctx() ctx: Context) {
    const cbq = ctx.callbackQuery;
    const dto =
      cbq && 'data' in cbq && cbq.data ? getSubjectConfirmData(cbq.data) : null;
    let user;
    if (ctx.from?.id) {
      user = await this.db.users.findUnique({
        select: {
          id: true,
        },
        where: {
          tg_id: ctx.from.id,
        },
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
      const { action, data: shift_id } = dto;
      this.logger.debug(`Action: ${action}, Shift ID: ${shift_id}`);

      const shift = await this.db.shift.findUnique({
        select: {
          date_start: true,
        },
        where: {
          id: shift_id,
        },
      });

      if (shift) {
        await this.db.user_shifts_table.update({
          data: { status: action === ShiftAction.Confirm },
          where: {
            user_id_shift_id: {
              shift_id,
              user_id: user.id,
            },
          },
        });

        switch (action) {
          case ShiftAction.Confirm:
            await ctx.reply(
              `✅ Смена ${formatUserDate(
                shift.date_start
              )} подтверждена. Спасибо за вашу помощь!`
            );
            break;
          case ShiftAction.Decline:
            await ctx.reply(
              `❌ Смена ${formatUserDate(
                shift.date_start
              )} отклонена. Спасибо за уведомление! Мы сообщим координаторам.`
            );
            break;
          default:
            this.logger.warn(`Unhandled action: ${action}`);
        }
        await ctx.editMessageReplyMarkup(undefined);
        await ctx.answerCbQuery('✅ Действие выполнено');
      } else {
        this.logger.error(
          `Shift with ID ${shift_id} not found in shifts table`
        );
        await ctx.reply('❌ Смена не найдена. Пожалуйста, попробуйте позже.');
      }
    }
  }
}
