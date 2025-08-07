import { firstValueFrom } from 'rxjs';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { rmqClient } from '@/server/rmq';

export const rpcRouter = createTRPCRouter({
  ping: publicProcedure.query(async () => {
    const pattern = 'ping';
    const payload = {};

    const res = await firstValueFrom(
      rmqClient.send<string, object>(pattern, payload)
    );
    return { res };
  }),
});
