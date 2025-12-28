import { Global, Injectable, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'pickup-point-db/client';

@Injectable()
export class PrismaDb extends PrismaClient {
  constructor(cs: ConfigService) {
    super({
      log: ['query', 'info'],
      adapter: new PrismaPg({
        connectionString: cs.getOrThrow('DATABASE_URL'),
      }),
    });
  }
}

@Global()
@Module({
  imports: [ConfigModule],
  providers: [PrismaDb],
  exports: [PrismaDb],
})
export class PrismaModule {}
