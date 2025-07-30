import { Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModuleAsyncOptions } from 'nestjs-telegraf/dist/interfaces';
import { session } from 'telegraf';

export const TelegrafConfig: TelegrafModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (cs: ConfigService) => {
    const token = cs.getOrThrow('TELEGRAM_BOT_TOKEN');
    const isTestEnv = cs.getOrThrow('TELEGRAM_BOT_TEST_ENV', '0') === '1';
    Logger.log(token, 'TelegrafConfig.useFactory');
    return {
      middlewares: [session()],
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
