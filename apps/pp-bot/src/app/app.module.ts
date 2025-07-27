import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { ScheduleModule } from '@nestjs/schedule';

import { AppUpdate } from './app.update';
import { TelegrafConfig } from './config';
import { DrizzleModule } from './drizzle';
import { WelcomeScene } from './modules/welcome/welcome.scene';
import { ShiftReminderService } from './modules/shift-reminder/shift-reminder.service';
import { ShiftUpdate } from './modules/shift-reminder/shift.update';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TelegrafModule.forRootAsync(TelegrafConfig),
    WelcomeScene,
    DrizzleModule
  ],
  providers: [AppUpdate, ShiftReminderService, ShiftUpdate],
})
export class AppModule {
}
