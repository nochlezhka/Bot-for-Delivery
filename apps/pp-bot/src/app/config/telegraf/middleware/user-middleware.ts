import { Inject, Injectable, Logger } from '@nestjs/common';
import { noop } from 'rxjs';
import { MiddlewareFn, MiddlewareObj } from 'telegraf';
import { BotCommandScopeChat } from 'telegraf/types';

import { AppCls } from '../../../app.cls';
import { PrismaDb } from '../../../prisma';
import { type TelegrafContext } from '../../../type';
import { DEFAULT_COMMANDS, USER_COMMANDS } from '../bot-commands';

@Injectable()
export class UserMiddleware implements MiddlewareObj<TelegrafContext> {
  @Inject() private readonly logger!: Logger;
  @Inject() private readonly prisma!: PrismaDb;
  @Inject() private readonly appCls!: AppCls;

  middleware(): MiddlewareFn<TelegrafContext> {
    return async (ctx: TelegrafContext, next) => {
      this.logger.debug('Processing update for user');

      const fromId = ctx.from?.id;
      let result = noop;

      if (fromId) {
        const user = await this.prisma.users.findUnique({
          where: { tg_id: fromId },
        });

        if (user && user.tg_id) {
          this.appCls.set('user', {
            id: user.id,
            role: user.role,
            tgId: Number(user.tg_id),
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
