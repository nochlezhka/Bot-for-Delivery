import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { ScheduleModule } from '@nestjs/schedule';

import { AppUpdate } from './app.update';
import { ShiftUpdate } from './shift.update';
import { TelegrafConfig } from './config';
import { DrizzleModule } from './drizzle';
import { WelcomeScene } from './modules/welcome/welcome.scene';
import { ReminderService } from './reminder.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TelegrafModule.forRootAsync(TelegrafConfig),
    WelcomeScene,
    DrizzleModule
  ],
  providers: [AppUpdate, ReminderService, ShiftUpdate],
})
export class AppModule {
}
