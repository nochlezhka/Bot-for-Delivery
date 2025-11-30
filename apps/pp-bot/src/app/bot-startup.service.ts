import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Logger } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { TelegrafContext } from './type';
import { COMMANDS } from './bot-commands';

@Injectable()
export class BotStartupService implements OnModuleInit {
  constructor(
    private readonly logger: Logger,

    @InjectBot()
    private readonly bot: Telegraf<TelegrafContext>,
  ) {}

  async onModuleInit() {
    await this.bot.telegram.setMyCommands(COMMANDS['guest']);
    this.logger.log('Telegram commands set.');
  }
}