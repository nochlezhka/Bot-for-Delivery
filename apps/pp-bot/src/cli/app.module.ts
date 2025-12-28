import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SetupHolidaysCliCommand } from './commands/setup-holidays.cli-command';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule, PrismaModule],
  providers: [SetupHolidaysCliCommand],
})
export class AppModule {}
