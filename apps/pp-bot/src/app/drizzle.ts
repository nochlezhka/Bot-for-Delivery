import { Global, Inject, Injectable, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { connectionFactory } from 'pickup-point-db';

type DrizzleDb = ReturnType<typeof connectionFactory>;
const DrizzleToken = Symbol('DrizzleInstance');
const DrizzleProvider: Provider<DrizzleDb> = {
  provide: DrizzleToken,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): DrizzleDb =>
    connectionFactory(configService.getOrThrow('DATABASE_URL')),
};

@Injectable()
export class Drizzle {
  @Inject(DrizzleToken) public readonly db!: DrizzleDb;
}

@Global()
@Module({
  imports: [ConfigModule],
  providers: [Drizzle, DrizzleProvider],
  exports: [Drizzle],
})
export class DrizzleModule {}
