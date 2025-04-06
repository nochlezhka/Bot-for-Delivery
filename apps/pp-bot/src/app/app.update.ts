import { Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Ctx, Help, On, Start, Update } from 'nestjs-telegraf';
import { schema } from 'pickup-point-db';

import { Drizzle } from './drizzle';
import { WELCOME_SCENE_ID } from './modules/welcome';
import { type TelegrafContext } from './type';

@Update()
export class AppUpdate {
  @Inject() private readonly drizzle!: Drizzle;

  async baseHandler(ctx: TelegrafContext) {
    const fromId = ctx.from?.id;
    if (fromId) {
      const existsUser = await this.drizzle.db.query.userTable.findFirst({
        where: eq(schema.userTable.tgId, BigInt(fromId)),
      });
      if (existsUser) {
        if (existsUser.role === 'guest') {
          await ctx.reply('Пожалуйста, ожидайте зачисления в волонтеры.');
        } else if (existsUser.role === 'volunteer') {
          await ctx.reply('Вы можете выбрать смены в приложении.');
        }
      } else {
        await ctx.scene.enter(WELCOME_SCENE_ID);
      }
    }
  }

  @Start()
  async start(@Ctx() ctx: TelegrafContext) {
    await this.baseHandler(ctx);
  }

  @Help()
  async help(@Ctx() ctx: TelegrafContext) {
    await this.baseHandler(ctx);
  }

  @On('text')
  async onText(@Ctx() ctx: TelegrafContext) {
    await this.baseHandler(ctx);
  }
}
