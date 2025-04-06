import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';

import { AppUpdate } from './app.update';
import { TelegrafConfig } from './config';
import { DrizzleModule } from './drizzle';
import { WelcomeScene } from './modules/welcome/welcome.scene';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegrafModule.forRootAsync(TelegrafConfig),
    WelcomeScene,
    DrizzleModule,
  ],
  providers: [AppUpdate],
})
export class AppModule {}
