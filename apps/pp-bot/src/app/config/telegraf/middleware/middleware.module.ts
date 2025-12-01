import { Logger, Module } from '@nestjs/common';

import { AsyncClsMiddleware } from './async-cls.middleware';
import { UserMiddleware } from './user-middleware';

@Module({
  providers: [UserMiddleware, AsyncClsMiddleware, Logger],
  exports: [UserMiddleware, AsyncClsMiddleware],
})
export class MiddlewareModule {}
