import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';
import { TelegrafModule } from 'nestjs-telegraf';

import { AppUpdate } from './app.update';
import { SendConfirmCommandHandler } from './commands';
import { TelegrafConfig } from './config';
import { DrizzleModule } from './drizzle';
import { ShiftConfirmModule } from './modules/shift-confirm';
import { WelcomeModule } from './modules/welcome';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TelegrafModule.forRootAsync(TelegrafConfig),
    DrizzleModule,

    WelcomeModule,
    ShiftConfirmModule,
  ],
  providers: [AppUpdate, SendConfirmCommandHandler, Logger],
})
export class AppModule {}
