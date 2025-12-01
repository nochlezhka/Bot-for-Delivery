import { Inject, Injectable } from '@nestjs/common';
import { noop } from 'rxjs';
import { MiddlewareObj } from 'telegraf';

import type { TelegrafContext } from '../../../type';

import { AppCls } from '../../../app.cls';

@Injectable()
export class AsyncClsMiddleware implements MiddlewareObj<TelegrafContext> {
  @Inject() private readonly appCls!: AppCls;

  middleware() {
    return async (_: TelegrafContext, next: typeof noop) => {
      return this.appCls.run(() => next());
    };
  }
}
