import { Global, Injectable, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'pickup-point-db/client';

@Injectable()
export class PrismaDb extends PrismaClient {
  constructor(cs: ConfigService) {
    super({
      adapter: new PrismaPg({
        connectionString: cs.getOrThrow('DATABASE_URL'),
      }),
    });
  }
}

@Global()
@Module({
  exports: [PrismaDb],
  imports: [ConfigModule],
  providers: [PrismaDb],
})
export class PrismaModule {}
