import { Logger, Module } from '@nestjs/common';

import { AsyncClsMiddleware } from './async-cls.middleware';
import { UserMiddleware } from './user-middleware';

@Module({
  exports: [UserMiddleware, AsyncClsMiddleware],
  providers: [UserMiddleware, AsyncClsMiddleware, Logger],
})
export class MiddlewareModule {}
