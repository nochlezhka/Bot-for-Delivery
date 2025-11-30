
import { Injectable, Inject } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { MiddlewareFn, MiddlewareObj } from 'telegraf';
import { BotCommandScopeChat } from 'telegraf/types';

import { type TelegrafContext, type User } from '../../type';
import { eq } from 'drizzle-orm';
import { schema, UserRoles } from 'pickup-point-db';

import { Drizzle } from '../../drizzle';
import { COMMANDS } from '../../bot-commands';


@Injectable()
export class UserMiddleware implements MiddlewareObj<TelegrafContext> {
  @Inject() private readonly logger!: Logger;
  @Inject() private readonly drizzle!: Drizzle;

  async setUserCommands(ctx: TelegrafContext, user: User) {
    const userScope: BotCommandScopeChat = {
      type: 'chat',
      chat_id: user.tgId,
    };

    await ctx.telegram.setMyCommands(
      COMMANDS[user.role], {scope: userScope,});
  }

  middleware(): MiddlewareFn<TelegrafContext> {
    return async (ctx: TelegrafContext, next) => {
       this.logger.log("Processing update for user");
        const fromId = ctx.from?.id;
        if (!fromId) {
          ctx.user = undefined;
          return next();
        }
        
        const user = await this.drizzle.db.query.userTable.findFirst({
          where: eq(schema.userTable.tgId, BigInt(fromId)),
        });
    
        if (user != null) {
          ctx.user = {
            id: Number(user.id),
            role: user.role,
            tgId: Number(user.tgId),
          }
        } else {
          ctx.user = {
            id: 0,
            role: 'unregistered' as UserRoles,
            tgId: Number(fromId),
          };
        }
        await this.setUserCommands(ctx, ctx.user);
      return next();
    };
  } 
}
