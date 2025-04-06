import { Module } from '@nestjs/common';

import { WelcomeScene } from './welcome.scene';

@Module({
  providers: [WelcomeScene],
})
export class WelcomeModule {}
