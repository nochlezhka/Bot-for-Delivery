import { Inject } from '@nestjs/common';
import { On, Scene, SceneEnter, SceneLeave } from 'nestjs-telegraf';
import { CallbackQuery, Message } from 'typegram';

import { PrismaDb } from '../../prisma';
import { type TelegrafContext } from '../../type';
import {
  REMOVE_KEYBOARD,
  REQUEST_CONTACT_KEYBOARD,
  REQUEST_GENDER_KEYBOARD,
  WELCOME_SCENE_ID,
} from './constant';
import { ExpectedState, ResultState } from './type';

@Scene(WELCOME_SCENE_ID)
export class WelcomeScene {
  @Inject() private readonly db!: PrismaDb;

  @On('callback_query')
  async callbackQuery(ctx: TelegrafContext) {
    ctx.scene.session.state = {
      ...(ctx.scene.session.state ?? {}),
      gender: (ctx.callbackQuery as CallbackQuery.DataQuery).data,
    };
    await ctx.scene.leave();
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
      contact: { first_name, last_name, phone_number, user_id: tg_id },
      gender,
    } = ctx.scene.session.state as ResultState;
    const tg_username = ctx.from?.username;
    if (tg_id) {
      await this.db.users.create({
        data: {
          gender,
          name: [last_name, first_name].join(' '),
          phone: phone_number,
          tg_id,
          tg_username,
        },
      });
    }
    await ctx.reply(
      'Вы зарегистрированы! Пожалуйста, ожидайте подтверждения статуса волонтера.'
    );
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
