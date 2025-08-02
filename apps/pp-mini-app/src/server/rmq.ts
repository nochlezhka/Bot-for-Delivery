import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

const client: ClientProxy = ClientProxyFactory.create({
  transport: Transport.RMQ,
  options: {
    urls: [process.env['AMQP_URL'] ?? 'amqp://guest:guest@localhost:5672'],
    queue: 'pp-bot',
    queueOptions: { durable: false },
  },
});
await client.connect();

// Отправка RPC-запроса 'ping' и получение ответа:
export async function rpcPing(): Promise<string> {
  const pattern = 'ping';
  const payload = {}; // нет тела, нам нужен только ping
  const observable$ = client.send<string, object>(pattern, payload);
  // Преобразуем cold Observable в Promise и ожидаем результат:
  const result: string = await firstValueFrom(observable$);
  return result;
}
