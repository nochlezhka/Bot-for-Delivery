import { Inject, Injectable, Logger } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { type uuid } from 'drizzle-orm/pg-core';

import { schema } from 'pickup-point-db';

import { Drizzle } from '../../drizzle';

@Injectable()
export class ShiftsService {
  @Inject() private readonly logger!: Logger;
  @Inject() private readonly drizzle!: Drizzle;

  async getShifts() {
    return this.drizzle.db.select().from(schema.shiftTable).orderBy(schema.shiftTable.dateStart);
  }

  async getShiftById(id: string) {
    const shifts = await this.drizzle.db.select().from(schema.shiftTable)
      .where(eq(schema.shiftTable.id, id));
    if (shifts.length === 0) {
      return null;
    }
    return shifts[0];
  }
}
