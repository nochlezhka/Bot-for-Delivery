import { Module, Logger } from '@nestjs/common';

import {ShiftsService} from './shifts.service';

@Module({
  providers: [ShiftsService, Logger],
  exports: [ShiftsService], 
})
export class ShiftsModule {}
