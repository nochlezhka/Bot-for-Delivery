import { Inject, Logger, UseGuards } from '@nestjs/common';
import { Action, Command, Ctx, Help, On, Start, Update } from 'nestjs-telegraf';
import { user_role } from 'pickup-point-db/client';
import { sprintf } from 'sprintf-js';
import { Markup } from 'telegraf';

import { AppCls } from './app.cls';
import { DEFAULT_COMMANDS, USER_COMMANDS } from './config';
import { WELCOME_SCENE_ID } from './modules/welcome';
import { PrismaDb } from './prisma';
import { Role } from './role.decorator';
import { RoleGuard } from './role.guard';
import { type TelegrafContext } from './type';
import {
  decodeSubjectAction,
  encodeSubjectAction,
  formatUserDate,
  SubjectWithAction,
} from './util';

enum AppActions {
  volunteerViewShift = 'volunteerViewShift',
  volunteerCollapseShift = 'volunteerCollapseShift',
  volunteerRegisterOnShift = 'volunteerRegisterOnShift',
}

@Update()
export class AppUpdate {
  @Inject() private readonly logger!: Logger;
  @Inject() private readonly appCls!: AppCls;
  @Inject() private readonly db!: PrismaDb;

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

  @Role([user_role.volunteer, user_role.coordinator, user_role.employee])
  @UseGuards(RoleGuard)
  @Command('select_shifts')
  async selectShiftListing(@Ctx() ctx: TelegrafContext) {
    const user_id = this.appCls.get('user.id')!;
    const shifts = await this.db.user_shifts_table.findMany({
      //@TODO: заменить вывод "моих смен" на смены пункта выдачи после настройки пунктов выдачи
      select: {
        shift: {
          select: {
            title: true,
            date_start: true,
            id: true,
          },
        },
      },
      where: {
        AND: [
          {
            OR: [{ status: true }, { status: null }],
          },
          {
            user_id,
          },
        ],
      },
      orderBy: {
        shift: {
          date_start: 'asc',
        },
      },
    });

    let keyboard = undefined;
    let text = 'No upcoming shifts';

    if (shifts.length > 0) {
      keyboard = Markup.inlineKeyboard(
        shifts.map(({ shift }) => [
          Markup.button.callback(
            sprintf(`%s ⬇️`, formatUserDate(shift.date_start)),
            encodeSubjectAction(AppActions.volunteerViewShift, shift.id)
          ),
        ])
      );
      text = 'Available Shifts:';
    }

    await ctx.reply(text, keyboard);
  }

  @Role([user_role.volunteer, user_role.coordinator, user_role.employee])
  @UseGuards(RoleGuard)
  @Action(SubjectWithAction(AppActions.volunteerViewShift))
  async volunteerViewShift(@Ctx() ctx: TelegrafContext) {
    const cbq = ctx.callbackQuery;
    const dto =
      cbq && 'data' in cbq && cbq.data ? decodeSubjectAction(cbq.data) : null;
    if (dto) {
      const shift = await this.db.shift.findUnique({ where: { id: dto.subj } });

      if (shift) {
        const text = sprintf(
          `*%s*\nначало: %s\nконец: %s`,
          shift.status,
          formatUserDate(shift.date_start),
          formatUserDate(shift.date_end)
        );

        await ctx.editMessageText(text, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: 'Collapse ⬆️',
                  callback_data: encodeSubjectAction(
                    AppActions.volunteerCollapseShift,
                    shift.id
                  ),
                },
              ],
              [
                {
                  text: 'Register',
                  callback_data: encodeSubjectAction(
                    AppActions.volunteerRegisterOnShift,
                    shift.id
                  ),
                },
              ],
            ],
          },
        });

        await ctx.answerCbQuery();
      } else {
        this.logger.warn(`Shift with ID  not found: ${JSON.stringify(dto)}`);
        await ctx.answerCbQuery('❌ Shift not found');
      }
    }
  }

  @On('text')
  async onText(@Ctx() ctx: TelegrafContext) {
    this.logger.debug('Text received');
    await this.baseHandler(ctx);
  }
}
