import { Inject } from '@nestjs/common';
import { Ctx, Help, On, Start, Update } from 'nestjs-telegraf';
import { COMMANDS } from './bot-commands';

import { Logger } from '@nestjs/common';
import { WELCOME_SCENE_ID } from './modules/welcome';
import { type TelegrafContext } from './type';

@Update()
export class AppUpdate {
  @Inject() private readonly logger!: Logger;

  async baseHandler(ctx: TelegrafContext) {
    if (!ctx.user) {
      return;
    }
    if (ctx.user.role !== 'unregistered') {
      if (ctx.user.role === 'guest') {
        await ctx.reply('Пожалуйста, ожидайте зачисления в волонтеры.');
      } else if (ctx.user.role === 'volunteer') {
        await ctx.reply('Вы можете выбрать смены в приложении.');
      }
    } else {
      await ctx.scene.enter(WELCOME_SCENE_ID);
    }
  }

  @Start()
  async start(@Ctx() ctx: TelegrafContext) {
    this.logger.log("Start pressed");
    await this.baseHandler(ctx);
  }

  @Help()
  async help(@Ctx() ctx: TelegrafContext) {
    const role = ctx.user?.role ?? 'guest';

    const commandList = COMMANDS[role]
      .map(c => `/${c.command} — ${c.description}`)
      .join('\n');

    await ctx.reply(`Доступные команды:\n\n${commandList}`);
  }

  @On('text')
  async onText(@Ctx() ctx: TelegrafContext) {
    this.logger.log("Text received");
    await this.baseHandler(ctx);
  }
}
