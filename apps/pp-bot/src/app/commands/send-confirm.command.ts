import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DEFAULT_BOT_NAME } from 'nestjs-telegraf';
import { Markup, Telegraf } from 'telegraf';

export enum ShiftAction {
  Confirm = 'confirm',
  Decline = 'decline',
  // You can add more actions here, e.g., Cancel = 'cancel'
}
export const getSubjectConfirmPattern = (subj: string) =>
  new RegExp(`^${subj}:(${Object.values(ShiftAction).join('|')}):(.+)$`);

export const getSubjectConfirmData = (encodedData: string) => {
  const [_, action, data] = encodedData.split(':') as [
    string,
    ShiftAction,
    string
  ];
  return {
    action,
    data,
  };
};

export class SendConfirmCommand {
  constructor(
    readonly userTgId: string,
    readonly msg: string,
    readonly subject: string,
    readonly id: string
  ) {}
}

@CommandHandler(SendConfirmCommand)
export class SendConfirmCommandHandler
  implements ICommandHandler<SendConfirmCommand>
{
  @Inject(DEFAULT_BOT_NAME) private readonly bot!: Telegraf;

  async execute({ id, msg, subject, userTgId }: SendConfirmCommand) {
    await this.bot.telegram.sendMessage(
      userTgId,
      msg,
      Markup.inlineKeyboard([
        Markup.button.callback(
          '✅ Подтвердить',
          `${subject}:${ShiftAction.Confirm}:${id}`
        ),
        Markup.button.callback(
          '❌ Отменить',
          `${subject}:${ShiftAction.Decline}:${id}`
        ),
      ])
    );
  }
}
