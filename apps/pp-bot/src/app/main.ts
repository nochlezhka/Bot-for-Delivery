import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

(async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      options: {
        noAck: false,
        queue: 'pp-bot',
        queueOptions: { durable: false },
        urls: [process.env['AMQP_URL'] ?? 'amqp://guest:guest@localhost:5672'],
      },
      transport: Transport.RMQ,
    }
  );

  await app.listen();

  Logger.log(`PickupPoint bot started 🚀`);
})();
