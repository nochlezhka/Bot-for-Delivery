import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from '../app/prisma';
import { SetupHolidaysCliCommand } from './commands/setup-holidays.cli-command';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule, PrismaModule],
  providers: [SetupHolidaysCliCommand, Logger],
})
export class AppModule {}
