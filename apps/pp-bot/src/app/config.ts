import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModuleAsyncOptions } from 'nestjs-telegraf/dist/interfaces';
import { session } from 'telegraf';

export const TelegrafConfig: TelegrafModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (cs: ConfigService) => ({
    middlewares: [session()],
    options:
      cs.getOrThrow('TELEGRAM_BOT_TEST_ENV', '0') === '1'
        ? {
            telegram: {
              testEnv: true,
            },
          }
        : {},
    token: cs.getOrThrow('TELEGRAM_BOT_TOKEN'),
  }),
};
