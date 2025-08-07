import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

export const rmqClient: ClientProxy = ClientProxyFactory.create({
  transport: Transport.RMQ,
  options: {
    urls: [process.env['AMQP_URL'] ?? 'amqp://guest:guest@localhost:5672'],
    queue: 'pp-bot',
    queueOptions: { durable: false },
  },
});
