import { Inject, Logger, UseGuards } from '@nestjs/common';
import { addMonths } from 'date-fns/addMonths';
import { millisecondsInHour } from 'date-fns/constants';
import { endOfMonth } from 'date-fns/endOfMonth';
import { getUnixTime } from 'date-fns/getUnixTime';
import { parseISO } from 'date-fns/parseISO';
import { Action, Command, Ctx, Help, On, Start, Update } from 'nestjs-telegraf';
import { shift_status, user_role } from 'pickup-point-db/client';
import { shiftGetPayload } from 'pickup-point-db/models';
import { RRule, rrulestr } from 'rrule';
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
  volunteerViewExistsShift = 'volunteerViewExistsShift',
  volunteerViewNewShift = 'volunteerViewNewShift',
  volunteerCollapseShift = 'volunteerCollapseShift',
  volunteerRegisterOnShift = 'volunteerRegisterOnShift',
}

const RegisterNotAllowedStatus = new Set<shift_status>([
  shift_status.busy,
  shift_status.weekend,
]);
const SHIFT_DEFAULT_DURATION = millisecondsInHour * 2;
const default_schedule = new RRule({
  byweekday: ['MO', 'WE', 'FR', 'SA'],
});

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
    const user = await this.db.users.findUnique({
      select: {
        pickup_point: {
          select: {
            schedule: true,
          },
        },
      },
      where: {
        id: user_id,
      },
    });
    const curDate = new Date();
    const lastDate = endOfMonth(addMonths(curDate, 2));

    const existShifts = (
      await this.db.shift.findMany({
        select: {
          title: true,
          date_start: true,
          id: true,
          status: true,
        },
        where: {
          date_start: {
            lte: lastDate,
            gt: curDate,
          },
        },
      })
    ).reduce(
      (res, shift) => {
        res.set(getUnixTime(shift.date_start), shift);
        return res;
      },
      new Map<
        number,
        shiftGetPayload<{
          select: {
            title: true;
            date_start: true;
            id: true;
            status: true;
          };
        }>
      >()
    );

    const scheduledShifts =
      user?.pickup_point && user?.pickup_point.schedule
        ? rrulestr(user.pickup_point.schedule).between(curDate, lastDate)
        : default_schedule.between(curDate, lastDate);

    const keyboard = new Array<any>();
    for (const date_start of scheduledShifts) {
      const date_key = getUnixTime(date_start);

      const existShift = existShifts.get(date_key);

      if (existShift) {
        if (!RegisterNotAllowedStatus.has(existShift.status)) {
          keyboard.push(
            Markup.button.callback(
              sprintf(`%s ⬇️`, formatUserDate(date_start)),
              encodeSubjectAction(
                AppActions.volunteerViewExistsShift,
                existShift.id
              )
            )
          );
        }
      } else {
        keyboard.push(
          Markup.button.callback(
            sprintf(`%s ⬇️`, formatUserDate(date_start)),
            encodeSubjectAction(
              AppActions.volunteerViewNewShift,
              date_start.toISOString()
            )
          )
        );
      }
    }

    let result;

    if (keyboard.length > 0) {
      result = ctx.reply('Available Shifts:', Markup.inlineKeyboard(keyboard));
    } else {
      result = ctx.reply('No upcoming shifts');
    }

    await result;
  }

  @Role([user_role.volunteer, user_role.coordinator, user_role.employee])
  @UseGuards(RoleGuard)
  @Action(SubjectWithAction(AppActions.volunteerViewNewShift))
  async volunteerViewNewShift(@Ctx() ctx: TelegrafContext) {
    const cbq = ctx.callbackQuery;
    const dto =
      cbq && 'data' in cbq && cbq.data ? decodeSubjectAction(cbq.data) : null;
    if (dto) {
      try {
        const date_start = parseISO(dto.subj);
        const date_end = new Date(
          date_start.getTime() + SHIFT_DEFAULT_DURATION
        );

        const text = sprintf(
          `*%s*\nначало: %s\nконец: %s`,
          'Смена ни кем не занята',
          formatUserDate(date_start),
          formatUserDate(date_end)
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
                    dto.subj
                  ),
                },
              ],
              [
                {
                  text: 'Register',
                  callback_data: encodeSubjectAction(
                    AppActions.volunteerRegisterOnShift,
                    dto.subj
                  ),
                },
              ],
            ],
          },
        });

        await ctx.answerCbQuery();
      } catch (e) {
        this.logger.warn(`Shift with ID  not found: ${JSON.stringify(dto)}`);
        await ctx.answerCbQuery('❌ Shift not found');
      }
    }
  }

  @Role([user_role.volunteer, user_role.coordinator, user_role.employee])
  @UseGuards(RoleGuard)
  @Action(SubjectWithAction(AppActions.volunteerViewExistsShift))
  async volunteerViewExistsShift(@Ctx() ctx: TelegrafContext) {
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
