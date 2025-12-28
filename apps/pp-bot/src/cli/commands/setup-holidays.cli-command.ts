import { HttpService } from '@nestjs/axios';
import { Inject } from '@nestjs/common';
import { differenceInSeconds } from 'date-fns/differenceInSeconds';
import { endOfDay } from 'date-fns/endOfDay';
import { startOfDay } from 'date-fns/startOfDay';
import { Command, CommandRunner } from 'nest-commander';

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
    this.http
      .get<ExpectedResponse>(HOLIDAY_CALENADAR_URL)
      .subscribe((response) =>
        this.db.shift.createMany({
          data: Array.from(Object.values(response.data))
            .filter(({ work }) => work === '0')
            .map(({ day, zag }) => {
              const date_start = startOfDay(day);
              const date_end = endOfDay(day);
              return {
                status: 'weekend',
                date_end,
                date_start,
                duration: differenceInSeconds(date_end, date_start),
                title: zag ?? '',
              };
            }),
        })
      );
  }
}
