import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

(async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env['AMQP_URL'] ?? 'amqp://guest:guest@localhost:5672'],
        queue: 'pp-bot',
        noAck: false,
        queueOptions: { durable: false },
      },
    }
  );

  await app.listen();

  Logger.log(`PickupPoint bot started 🚀`);
})();
