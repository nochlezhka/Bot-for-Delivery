import { rmqClient } from './src/server/rmq';

export async function register() {
  await rmqClient.connect();
}
