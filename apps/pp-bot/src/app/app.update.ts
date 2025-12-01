import { Inject, Logger } from '@nestjs/common';
import { Ctx, Help, On, Start, Update } from 'nestjs-telegraf';

import { AppCls } from './app.cls';
import { DEFAULT_COMMANDS, USER_COMMANDS } from './config';
import { WELCOME_SCENE_ID } from './modules/welcome';
import { type TelegrafContext } from './type';

@Update()
export class AppUpdate {
  @Inject() private readonly logger!: Logger;
  @Inject() private readonly appCls!: AppCls;

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

  @On('text')
  async onText(@Ctx() ctx: TelegrafContext) {
    this.logger.debug('Text received');
    await this.baseHandler(ctx);
  }
}
