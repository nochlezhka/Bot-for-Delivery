import { Inject, Logger, UseGuards } from '@nestjs/common';
import { Ctx, Help, On, Start, Update, Command, Action } from 'nestjs-telegraf';

import {Markup} from 'telegraf';

import { AppCls } from './app.cls';
import { DEFAULT_COMMANDS, USER_COMMANDS } from './config';
import { WELCOME_SCENE_ID } from './modules/welcome';
import { type TelegrafContext } from './type';
import { Role } from './role.decorator';
import {RoleGuard} from './role.guard';
import { ShiftsService } from './modules/shifts/shifts.service';

export const SHIFT_PATTERN = new RegExp(`^shift:([\w\d\-]+):(.*)$`);

@Update()
export class AppUpdate {
  @Inject() private readonly logger!: Logger;
  @Inject() private readonly appCls!: AppCls;
  @Inject() private readonly shiftService!: ShiftsService;

  async baseHandler(ctx: TelegrafContext) {
    const userRole = this.appCls.get('user.role');
    if (userRole) {
      switch (userRole) {
        case 'guest':
          await ctx.reply('Пожалуйста, ожидайте зачисления в волонтеры.');
          break;
        case 'coordinator':
        case 'volunteer':
        case 'employee':
          await ctx.reply('Вы можете выбрать смены в приложении.');
      }
    } else {
      await ctx.scene.enter(WELCOME_SCENE_ID);
    }
  }

  @Start()
  async start(@Ctx() ctx: TelegrafContext) {
    this.logger.debug('Start pressed');
    await this.baseHandler(ctx);
  }

  @Help()
  async help(@Ctx() ctx: TelegrafContext) {
    const role = this.appCls.get('user.role');

    const commandList = (role ? USER_COMMANDS[role] : DEFAULT_COMMANDS)
      .map((c) => `/${c.command} — ${c.description}`)
      .join('\n');

    await ctx.reply(`Доступные команды:\n\n${commandList}`);
  }


  @Role(['volunteer'])
  @UseGuards(RoleGuard)
  @Command('shifts')
  async onShifts(@Ctx() ctx: TelegrafContext) {
    this.logger.log('Shifts command called');
    const shifts = await this.shiftService.getShifts();

    if (shifts.length == 0) {
      const text = 'No upcoming shifts';
      await ctx.reply(text);
      return;
    }

    const keyboard = Markup.inlineKeyboard(shifts.map(s => [
        Markup.button.callback(`${s.title} ⬇️`, `shift:${s.id}:expand`)
    ]
    ));

    this.logger.log('action: ', `shift:${shifts[0].id}:expand`);

    const text = 'Available Shifts:';
    await ctx.reply(text, keyboard);
  }

  // @Role(['volunteer'])
  // @UseGuards(RoleGuard)
  @Action(/^shift:([\w\d-]+):(.*)$/)
  async expandShift(@Ctx() ctx: TelegrafContext) {
    const shiftId = ctx.match![0];
    const action = ctx.match![1];
    const shift = await this.shiftService.getShiftById(shiftId);

    const shifts = await this.shiftService.getShifts();

    if (!shift) {
      this.logger.error(`Shift with ID ${shiftId} not found`);
      await ctx.answerCbQuery('❌ Shift not found');
      return;
    }

    const text =
      `*${shift.title}* (${shift.dateStart}–${shift.dateEnd})\n` +
      `📍 *Status:* ${shift.status}\n`;

    await ctx.editMessageText(text, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Collapse ⬆️',
              callback_data: `shift:${shiftId}:collapse`,
            },
          ],
          [
            {
              text: 'Register',
              callback_data: `shift:${shiftId}:register`,
            },
          ],
        ],
      },
    });

    await ctx.answerCbQuery();
  }


  // Generic text handler should be last!
  @On('text')
  async onText(@Ctx() ctx: TelegrafContext) {
    this.logger.debug('Text received');
    await this.baseHandler(ctx);
  }
}
