import { Inject } from '@nestjs/common';
import { On, Scene, SceneEnter, SceneLeave } from 'nestjs-telegraf';
import { schema } from 'pickup-point-db';
import { CallbackQuery, Message } from 'typegram';

import {
  REQUEST_CONTACT_KEYBOARD,
  REQUEST_GENDER_KEYBOARD,
  REMOVE_KEYBOARD,
  WELCOME_SCENE_ID,
} from './constant';
import { ExpectedState, ResultState } from './type';
import { Drizzle } from '../../drizzle';
import { type TelegrafContext } from '../../type';

@Scene(WELCOME_SCENE_ID)
export class WelcomeScene {
  @Inject() private readonly drizzle!: Drizzle;

  @SceneEnter()
  async onSceneEnter(ctx: TelegrafContext) {
    await ctx.reply(
      'Для регистрации необходимо указать ваш номер',
      REQUEST_CONTACT_KEYBOARD
    );
  }

  @SceneLeave()
  async onSceneLeave(ctx: TelegrafContext) {
    const {
      gender,
      contact: { user_id, phone_number, last_name, first_name },
    } = ctx.scene.session.state as ResultState;
    const tgUsername = ctx.from?.username;
    if (user_id) {
      await this.drizzle.db.insert(schema.userTable).values({
        tgUsername,
        gender,
        name: [last_name, first_name].join(' '),
        phone: phone_number,
        tgId: BigInt(user_id),
      });
    }
    await ctx.reply('Вы зарегистрированы! Пожалуйста, ожидайте подтверждения статуса волонтера.');
  }

  @On('contact')
  async onContactShared(ctx: TelegrafContext) {
    ctx.scene.session.state = {
      ...(ctx.scene.session.state ?? {}),
      contact: (ctx.message as Message.ContactMessage).contact,
    };
    await ctx.reply('Спасибо! Контакт получен.', REMOVE_KEYBOARD);
    await ctx.reply('Теперь необходимо указать пол', REQUEST_GENDER_KEYBOARD);
  }

  @On('callback_query')
  async callbackQuery(ctx: TelegrafContext) {
    ctx.scene.session.state = {
      ...(ctx.scene.session.state ?? {}),
      gender: (ctx.callbackQuery as CallbackQuery.DataQuery).data,
    };
    await ctx.scene.leave();
  }

  @On('text')
  async text(ctx: TelegrafContext) {
    const currentSate = ctx.scene.session.state as ExpectedState;
    if (!currentSate.contact) {
      await ctx.reply(
        'Пожалуйста, поделитесь своим контактом',
        REQUEST_CONTACT_KEYBOARD
      );
    } else if (!currentSate.gender) {
      await ctx.reply('Пожалуйста, укажите свой пол', REQUEST_GENDER_KEYBOARD);
    } else {
      await ctx.scene.leave();
    }
  }
}
