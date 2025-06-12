import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { DbLibModule } from '@lib/db-lib';
import { GeoLibModule } from '@lib/geo-lib';
import { BullModule } from '@nestjs/bullmq';
import { NotifyLibModule } from '@lib/notify-lib';
import { ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    DbLibModule,
    GeoLibModule,
    BullModule.registerQueue({
      name: 'trips',
    }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        options: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
    NotifyLibModule,
  ],
  providers: [TripsService],
  controllers: [TripsController],
})
export class TripsModule {}
