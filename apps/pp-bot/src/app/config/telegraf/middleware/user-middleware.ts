import { Inject, Injectable, Logger } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { schema } from 'pickup-point-db';
import { noop } from 'rxjs';
import { MiddlewareFn, MiddlewareObj } from 'telegraf';
import { BotCommandScopeChat } from 'telegraf/types';

import { AppCls } from '../../../app.cls';
import { Drizzle } from '../../../drizzle';
import { type TelegrafContext } from '../../../type';
import { DEFAULT_COMMANDS, USER_COMMANDS } from '../bot-commands';

@Injectable()
export class UserMiddleware implements MiddlewareObj<TelegrafContext> {
  @Inject() private readonly logger!: Logger;
  @Inject() private readonly drizzle!: Drizzle;
  @Inject() private readonly appCls!: AppCls;

  middleware(): MiddlewareFn<TelegrafContext> {
    return async (ctx: TelegrafContext, next) => {
      this.logger.debug('Processing update for user');

      const fromId = ctx.from?.id;
      let result = noop;

      if (fromId) {
        const user = await this.drizzle.db.query.userTable.findFirst({
          where: eq(schema.userTable.tgId, BigInt(fromId)),
        });

        if (user) {
          this.appCls.set('user', {
            id: Number(user.id),
            role: user.role,
            tgId: Number(user.tgId),
          });
        } else {
          this.appCls.set('user', {
            id: null,
            role: null,
            tgId: Number(fromId),
          });
        }

        const userScope: BotCommandScopeChat = {
          type: 'chat',
          chat_id: this.appCls.get('user.tgId'),
        };

        const resultRole = this.appCls.get('user.role');
        await ctx.telegram.setMyCommands(
          resultRole ? USER_COMMANDS[resultRole] : DEFAULT_COMMANDS,
          {
            scope: userScope,
          }
        );

        result = next;
      }

      return result();
    };
  }
}
