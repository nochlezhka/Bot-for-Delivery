import { Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModuleAsyncOptions } from 'nestjs-telegraf/dist/interfaces';
import { session } from 'telegraf';

import { UserMiddlewareModule } from './modules/user-middleware'
import { UserMiddleware } from './modules/user-middleware/user-middleware'

export const TelegrafConfig: TelegrafModuleAsyncOptions = {
  imports: [ConfigModule, UserMiddlewareModule],
  inject: [ConfigService, UserMiddleware],
  useFactory: (cs: ConfigService, um: UserMiddleware) => {
    const token = cs.getOrThrow('TELEGRAM_BOT_TOKEN');
    const isTestEnv = cs.getOrThrow('TELEGRAM_BOT_TEST_ENV', '0') === '1';
    Logger.log(token, 'TelegrafConfig.useFactory');
    return {
      middlewares: [session(), um.middleware()],
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
