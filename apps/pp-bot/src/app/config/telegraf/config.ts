import { Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModuleAsyncOptions } from 'nestjs-telegraf/dist/interfaces';
import { session } from 'telegraf';

import {
  AsyncClsMiddleware,
  MiddlewareModule,
  UserMiddleware,
} from './middleware';

export const TelegrafConfig: TelegrafModuleAsyncOptions = {
  imports: [ConfigModule, MiddlewareModule],
  inject: [ConfigService, UserMiddleware, AsyncClsMiddleware],
  useFactory: (
    cs: ConfigService,
    um: UserMiddleware,
    acm: AsyncClsMiddleware
  ) => {
    const token = cs.getOrThrow('TELEGRAM_BOT_TOKEN');
    const isTestEnv = cs.getOrThrow('TELEGRAM_BOT_TEST_ENV', '0') === '1';
    Logger.log(token, 'TelegrafConfig.useFactory');
    return {
      middlewares: [session(), acm.middleware(), um.middleware()],
      options: isTestEnv
        ? {
            telegram: {
              testEnv: true,
            },
          }
        : {},
      token,
    };
  },
};
