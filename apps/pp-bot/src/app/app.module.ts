import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';
import { ClsModule } from 'nestjs-cls';
import { InjectBot, TelegrafModule } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

import { AppClsModule } from './app.cls';
import { AppUpdate } from './app.update';
import { SendConfirmCommandHandler } from './commands';
import { DEFAULT_COMMANDS, TelegrafConfig } from './config';
import { DrizzleModule } from './drizzle';
import { RpcModule } from './modules/rpc';
import { ShiftConfirmModule } from './modules/shift-confirm';
import { ShiftsModule } from './modules/shifts';
import { WelcomeModule } from './modules/welcome';
import { TelegrafContext } from './type';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
    }),
    AppClsModule,
    CqrsModule.forRoot(),
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    DrizzleModule,

    TelegrafModule.forRootAsync(TelegrafConfig),

    WelcomeModule,
    ShiftConfirmModule,
    RpcModule,
    ShiftsModule,
  ],
  providers: [AppUpdate, SendConfirmCommandHandler, Logger],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly logger: Logger,
    @InjectBot()
    private readonly bot: Telegraf<TelegrafContext>
  ) {}

  async onModuleInit() {
    await this.bot.telegram.setMyCommands(DEFAULT_COMMANDS);
    this.logger.log('Telegram commands set.');
  }
}
