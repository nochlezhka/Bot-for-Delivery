import { HttpService } from '@nestjs/axios';
import { Inject } from '@nestjs/common';
import { differenceInSeconds } from 'date-fns/differenceInSeconds';
import { endOfDay } from 'date-fns/endOfDay';
import { startOfDay } from 'date-fns/startOfDay';
import { Command, CommandRunner } from 'nest-commander';
import { schema, ShiftStatus } from 'pickup-point-db';

import { Drizzle } from '../../app/drizzle';

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
  @Inject() private readonly drizzle!: Drizzle;

  async run() {
    this.http
      .get<ExpectedResponse>(HOLIDAY_CALENADAR_URL)
      .subscribe((response) =>
        this.drizzle.db
          .insert(schema.shiftTable)
          .values(
            Array.from(Object.values(response.data))
              .filter(({ work }) => work === '0')
              .map(({ day, zag }) => {
                const dateStart = startOfDay(day);
                const dateEnd = endOfDay(day);
                return {
                  status: 'weekend' as ShiftStatus,
                  dateEnd,
                  dateStart,
                  duration: differenceInSeconds(dateEnd, dateStart),
                  title: zag ?? '',
                };
              })
          )
          .onConflictDoNothing()
          .execute()
      );
  }
}
