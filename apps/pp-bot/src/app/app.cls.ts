import { Global, Module } from '@nestjs/common';
import { ClsService, ClsStore } from 'nestjs-cls';

import { User } from './type';

interface AppClsStore extends ClsStore {
  user: User;
}
export class AppCls extends ClsService<AppClsStore> {}

@Global()
@Module({
  exports: [AppCls],
  providers: [
    {
      provide: AppCls,
      useExisting: ClsService,
    },
  ],
})
export class AppClsModule {}
