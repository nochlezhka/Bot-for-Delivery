import { HttpService } from '@nestjs/axios';
import { Inject } from '@nestjs/common';
import { endOfDay } from 'date-fns/endOfDay';
import { startOfDay } from 'date-fns/startOfDay';
import { Command, CommandRunner } from 'nest-commander';
import { firstValueFrom } from 'rxjs';

import type { shiftCreateManyInput } from 'pickup-point-db/models';

import { PrismaDb } from '../../app/prisma';

const HOLIDAY_CALENADAR_URL = 'https://api.sm.su/v1/calendar/business';
type ExpectedResponse = Record<
  string,
  {
    day: string;
    work: '0' | '1';
    type: string;
    zag: string;
  }
>;

@Command({ name: 'setup:holidays' })
export class SetupHolidaysCliCommand extends CommandRunner {
  @Inject() private readonly http!: HttpService;
  @Inject() private readonly db!: PrismaDb;

  async run() {
    const response = await firstValueFrom(
      this.http.get<ExpectedResponse>(HOLIDAY_CALENADAR_URL)
    );
    const holidaysInfo = Array.from(Object.values(response.data));

    const data = new Array<shiftCreateManyInput>();
    for (const dayInfo of holidaysInfo) {
      if (dayInfo.work === '0') {
        const date_start = startOfDay(dayInfo.day);
        const date_end = endOfDay(dayInfo.day);
        data.push({
          status: 'weekend',
          date_end,
          date_start,
          title: dayInfo.zag ?? '',
        });
      }
    }
    await this.db.shift.createMany({
      data,
    });
  }
}
