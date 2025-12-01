import { Global, Module } from '@nestjs/common';
import { ClsService, ClsStore } from 'nestjs-cls';

import { User } from './type';

interface AppClsStore extends ClsStore {
  user: User;
}
export class AppCls extends ClsService<AppClsStore> {}

@Global()
@Module({
  providers: [
    {
      provide: AppCls,
      useExisting: ClsService,
    },
  ],
  exports: [AppCls],
})
export class AppClsModule {}
