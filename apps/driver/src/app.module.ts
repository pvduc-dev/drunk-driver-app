import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TripsModule } from './trips/trips.module';
import { BullModule } from '@nestjs/bullmq';
import { MongooseModule } from '@nestjs/mongoose';
import { DriversModule } from './drivers/drivers.module';
import { OtpsModule } from './otps/otps.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        user: configService.get<string>('MONGODB_USER'),
        pass: configService.get<string>('MONGODB_PASSWORD'),
        dbName: configService.get<string>('MONGODB_DB_NAME'),
        autoIndex: true,
        authSource: 'admin',
        retryWrites: true,
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    TripsModule,
    DriversModule,
    OtpsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
