import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';

@Controller()
export class RpcController {
  @MessagePattern('ping')
  ping(@Ctx() context: RmqContext): string {
    const message = context.getMessage();
    const channel = context.getChannelRef();
    channel.ack(message);
    return 'pong';
  }
}
