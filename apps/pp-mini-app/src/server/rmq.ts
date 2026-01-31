import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

export const rmqClient: ClientProxy = ClientProxyFactory.create({
  options: {
    queue: 'pp-bot',
    queueOptions: { durable: false },
    urls: [process.env['AMQP_URL'] ?? 'amqp://guest:guest@localhost:5672'],
  },
  transport: Transport.RMQ,
});
