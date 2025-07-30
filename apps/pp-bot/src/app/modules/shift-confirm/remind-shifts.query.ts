import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { and, eq, gt, InferSelectModel, lt } from 'drizzle-orm';
import { schema } from 'pickup-point-db';

import { Drizzle } from '../../drizzle';

export class RemindShiftsQuery {}

type UserShiftWithUser = InferSelectModel<typeof schema.userShiftsTable> & {
  user: InferSelectModel<typeof schema.userTable>;
};

type ShiftWithUserShifts = InferSelectModel<typeof schema.shiftTable> & {
  userShifts: UserShiftWithUser[];
};

@QueryHandler(RemindShiftsQuery)
export class RemindShiftsQueryHandler
  implements IQueryHandler<RemindShiftsQuery>
{
  @Inject() private readonly drizzle!: Drizzle;

  execute(_: RemindShiftsQuery): Promise<ShiftWithUserShifts[]> {
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    return this.drizzle.db.query.shiftTable.findMany({
      where: and(
        gt(schema.shiftTable.dateStart, now),
        lt(schema.shiftTable.dateStart, in24h)
      ),
      with: {
        userShifts: {
          where: eq(schema.userShiftsTable.confirmationRequestSent, false),
          with: {
            user: true,
          },
        },
      },
    });
  }
}
