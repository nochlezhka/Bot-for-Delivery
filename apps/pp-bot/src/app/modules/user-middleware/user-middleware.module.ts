import { Logger, Module } from '@nestjs/common';
import { UserMiddleware } from './user-middleware';

@Module({
  providers: [UserMiddleware, Logger],
  exports: [UserMiddleware],
})
export class UserMiddlewareModule {}