import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { DbLibModule } from '@lib/db-lib';
import { GeoLibModule } from '@lib/geo-lib';
import { NotifyLibModule } from '@lib/notify-lib';
import { ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { JobLibModule } from '@lib/job-lib';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    DbLibModule,
    GeoLibModule,
    JobLibModule,
    BullModule.registerQueue({
      name: 'SEARCH_DRIVER',
    }),
    BullModule.registerQueue({
      name: 'CANCEL_SEACHING',
    }),
    BullModule.registerQueue({
      name: 'CANCEL_REQUEST',
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
